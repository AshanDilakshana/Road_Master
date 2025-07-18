const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, markAsRead, deleteMessage } = require('../controllers/MessageController');

// Send a new message
router.post('/send', sendMessage);
// Get all messages for a user
router.get('/get', getMessages);
// Mark a message as read
router.put('/read/:id', markAsRead);
// Delete a message
router.delete('/delete/:id', deleteMessage);

module.exports = router; 