const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken, blockDemoWrites } = require('../middleware/authMiddleware');

router.get('/', verifyToken, taskController.getTasks);
router.post('/', verifyToken, taskController.createTask);
router.delete('/history/all', verifyToken, taskController.clearHistory);
router.delete('/:id', verifyToken, taskController.deleteTask);

module.exports = router;
