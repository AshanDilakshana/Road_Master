const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/usersController');

// Define routes for user operations

router.get('/', getUsers); 
router.post('/', createUser);

module.exports = router;