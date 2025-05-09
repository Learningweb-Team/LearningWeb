import Progress from '../models/Progress.js';
import Course from '../models/Course.js';

// Get or create user progress
export const getProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    let progress = await Progress.findOne({ userId, courseId })
      .populate('lastWatchedVideo.videoId', 'title')
      .populate('lastWatchedVideo.moduleId', 'title');

    if (!progress) {
      // Create new progress record if doesn't exist
      const course = await Course.findById(courseId);
      const totalVideos = course.modules.reduce(
        (sum, module) => sum + module.classes.length, 0
      );

      progress = new Progress({
        userId,
        courseId,
        completedVideos: [],
        totalVideos,
        percentage: 0
      });
      await progress.save();
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get progress',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update last watched video
export const updateWatchProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;
    const { videoId, timestamp } = req.body;

    const progress = await Progress.findOneAndUpdate(
      { userId, courseId },
      { 
        $set: { 
          'lastWatchedVideo.videoId': videoId,
          'lastWatchedVideo.timestamp': timestamp,
          lastUpdated: new Date()
        } 
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update watch progress',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Mark video as completed
export const markVideoCompleted = async (req, res) => {
    try {
      const { courseId } = req.params;
      const userId = req.user._id;
      const { videoId } = req.body;
  
      // First get the current progress
      const progress = await Progress.findOne({ userId, courseId });
      if (!progress) {
        return res.status(404).json({ success: false, message: 'Progress not found' });
      }
  
      // Check if video already completed
      if (progress.completedVideos.includes(videoId)) {
        return res.status(200).json({ success: true, data: progress });
      }
  
      // Update progress
      const updatedProgress = await Progress.findOneAndUpdate(
        { userId, courseId },
        { 
          $addToSet: { completedVideos: videoId },
          $set: { lastUpdated: new Date() }
        },
        { new: true }
      );
  
      // Calculate and update percentage
      updatedProgress.percentage = Math.round(
        (updatedProgress.completedVideos.length / updatedProgress.totalVideos) * 100
      );
      await updatedProgress.save();
  
      res.status(200).json({
        success: true,
        data: updatedProgress
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to mark video as completed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };