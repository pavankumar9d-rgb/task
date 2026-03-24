const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, blockDemoWrites } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/genre', verifyToken, blockDemoWrites, authController.updateGenre);

module.exports = router;
