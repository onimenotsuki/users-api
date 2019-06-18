const express = require('express');
const router = express.Router();

// Controllers
const usersController = require('../controllers/users.controller');

router.get('/populate', usersController.populateUsers);

router.route('/')
  .get(usersController.getUsers)
  .post(usersController.createUser);

router.route('/:id')
  .get(usersController.getUser)
  .put(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
