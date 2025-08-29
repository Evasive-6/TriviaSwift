import express from 'express';
import User from '../models/User.js';
import { validateUserRegistration, validateUserLogin, validateUserUpdate } from '../middleware/validation.js';
import { generateToken, protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register new user
// @access  Public
router.post('/register', validateUserRegistration, async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password
    });

    await user.save();

    res.status(201).json({
      success: true,
      data: {
        user: user.toPublicProfile(),
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/users/login
// @desc    Login user and get token
// @access  Public
router.post('/login', validateUserLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.checkPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    res.json({
      success: true,
      data: {
        user: user.toPublicProfile(),
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: req.user.toPublicProfile()
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', protect, validateUserUpdate, async (req, res, next) => {
  try {
    const updates = req.body;

    if (updates.username) {
      updates.username = updates.username.toLowerCase();
    }
    if (updates.email) {
      updates.email = updates.email.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: user.toPublicProfile()
    });
  } catch (error) {
    next(error);
  }
});

export default router;
