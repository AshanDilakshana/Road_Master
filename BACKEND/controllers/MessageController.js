const Message = require('../models/Message');

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { sender, recipient, subject, content } = req.body;
    const message = new Message({ sender, recipient, subject, content });
    await message.save();
    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Get all messages for a user (as recipient or sender)
const getMessages = async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) {
      return res.status(400).json({ message: 'User parameter is required' });
    }
    const messages = await Message.find({ $or: [{ recipient: user }, { sender: user }] }).sort({ timestamp: -1 });
    res.status(200).json({ message: 'Messages fetched successfully', data: messages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// Mark a message as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({ message: 'Message marked as read', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Error updating message', error: error.message });
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
};

module.exports = { sendMessage, getMessages, markAsRead, deleteMessage }; 