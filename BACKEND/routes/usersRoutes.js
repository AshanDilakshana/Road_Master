const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/usersController');
const{logging} = require('../controllers/logging');

// Define routes for user operations

router.get('/admins', getUsers); 
router.post('/admins_create', createUser);
router.post('/logging', logging);







module.exports = router;