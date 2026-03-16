const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');

router.route('/')
    .get(habitController.getHabits)
    .post(habitController.createHabit);

router.route('/:id')
    .put(habitController.updateHabit)
    .delete(habitController.deleteHabit);

module.exports = router;
