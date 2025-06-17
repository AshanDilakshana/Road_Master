const mongoose = require('mongoose');
const user= require('../models/users');

const getUsers = async (req, res) => {
    try {
        const users = await user.find();
        res.status(200).json(users);
    }catch (error) {
        res.status(500).json({message: 'Error fetching users', error: error.message});
    }
};


const createUser = async (req, res) => {
     try {
           const newuser = new user(req.body);
           await newuser.save();
           res.jason({message: 'User created successfully'}); 
        }catch (error) {
            res.status(500).json({message: 'Error User created', error: error.message});
};
    };







    
        
module.exports = {getUsers,createUser};
