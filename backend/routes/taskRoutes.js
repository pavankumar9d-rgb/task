const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken, blockDemoWrites } = require('../middleware/authMiddleware');

router.get('/', verifyToken, taskController.getTasks);
router.post('/', verifyToken, blockDemoWrites, taskController.createTask);
router.delete('/history/all', verifyToken, blockDemoWrites, taskController.clearHistory);
router.delete('/:id', verifyToken, blockDemoWrites, taskController.deleteTask);

module.exports = router;
