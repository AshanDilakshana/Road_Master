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
           res.json({message: 'User created successfully'}); 
        }catch (error) {
            res.status(500).json({message: 'Error User created', error: error.message});
};
    };

    
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await user.findByIdAndDelete(id);
        console.log("Deleting admin with ID:", _id);
        if (!deletedUser) {
            return res.status(404)
            .json({message: 'User not found'});
        }
        res.status(200)
        .json({message: 'User deleted successfully'});
    } catch (error) {
        res.status(500).json({message: 'Error deleting user', error: error.message});
    }
    

};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await user.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};



    
        
module.exports = {getUsers,createUser, deleteUser,updateUser};
