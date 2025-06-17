const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/usersController');

// Define routes for user operations

router.get('/admins', getUsers); 
router.post('/admins_create', createUser);

module.exports = router;