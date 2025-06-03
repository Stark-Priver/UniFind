import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';
import LostItem from '../models/LostItem.js';
import FoundItem from '../models/FoundItem.js';
import Message from '../models/Message.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all claims
router.get('/claims', [auth, isAdmin], async (req, res) => {
  try {
    const foundItems = await FoundItem.find()
      .populate('finder', 'name email')
      .sort('-createdAt');
    res.json(foundItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update claim status
router.patch('/claims/:id', [auth, isAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const foundItem = await FoundItem.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('finder', 'name email');
    
    res.json(foundItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all messages for admin
router.get('/messages', [auth, isAdmin], async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort('-createdAt');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;