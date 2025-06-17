const mongoose = require('mongoose');
const loggingx = require('../models/users');
const express = require('express');
const router = express.Router();


const logging = async (req, res) => { 
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await loggingx.findOne({email});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }
console.log('User logged in successfully:', user);
        if (user.email.includes('admin')) {
            return res.json({ message: 'Subadmin logged in successfully' },user);
        }
        else if (user.email.includes('subadmin')) {
            return res.json({ message: 'Admin logged in successfully' },user);
        }
        else {
            return res.json({ message: 'User logged in successfully' },user);
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = {logging};
