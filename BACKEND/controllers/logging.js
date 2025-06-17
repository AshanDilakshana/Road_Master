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

        if (user.email.includes('SubAdmin')) {
            return res.json({ message: 'Subadmin logged in successfully' ,userType: "SubAdmin"},user);
        }
        else if (user.email.includes('Admin')) {
            return res.json({ message: 'Admin logged in successfully' ,userType: "Admin"},user);
        }
        else {
            return res.json({ message: 'User logged in successfully',userType: "user"},user);
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error'});
    }

    
}
module.exports = {logging};
