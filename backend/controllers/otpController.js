import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import OTP from '../models/OTP.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();
// Configure email transporter (use proper SMTP service)
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your preferred service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
    logger: true, // Add this
    debug: true // Add this

});

// Generate and send OTP
export const sendOTP = async (req, res) =>{
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    // Save OTP to database
    await OTP.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // Email options to avoid spam
    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Your OTP for password reset is:</p>
          <div style="background: #f4f4f4; padding: 10px; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 2px; display: inline-block; margin: 10px 0;">
            ${otp}
          </div>
          <p>This OTP is valid for 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
      headers: {
        'X-Priority': '1', // High priority
        'X-MSMail-Priority': 'High',
        'Importance': 'High'
      }
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) =>  {
  try {
    const { email, otp } = req.body;

    // Find the OTP record
    const otpRecord = await OTP.findOne({ email });
    
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    // Check if OTP matches and is not expired
    if (otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark OTP as verified (optional)
    otpRecord.verified = true;
    await otpRecord.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};

// Reset password after OTP verification
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp, verified: true });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Find user and update using save() to trigger hooks
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save(); // This will trigger pre-save hook

    await OTP.deleteOne({ email });
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};