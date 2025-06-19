const express = require('express');
const router = express.Router();
const { getUsers, createUser ,deleteUser,updateUser} = require('../controllers/usersController');
const{logging} = require('../controllers/logging');

// Define routes for user operations

router.get('/admins', getUsers); 
router.post('/admins_create', createUser);
router.post('/logging', logging);
router.delete('/admins_delete/:id', deleteUser)
router.put('/admins_update/:id', updateUser);







module.exports = router;