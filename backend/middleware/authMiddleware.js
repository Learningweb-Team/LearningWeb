import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes middleware - verifies JWT token
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Unauthorized. No token provided.' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ 
        message: 'Unauthorized. User not found.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Authentication Error:', error.message);
    return res.status(401).json({ 
      message: 'Unauthorized. Invalid or expired token.' 
    });
  }
};

// Admin middleware - verifies user has admin role
export const admin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Forbidden. Admin access required.' 
    });
  }
};