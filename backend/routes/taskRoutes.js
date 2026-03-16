const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.route('/')
    .get(taskController.getTasks)
    .post(taskController.createTask);

router.route('/:id')
    .put(taskController.updateTask)
    .delete(taskController.deleteTask);

module.exports = router;
