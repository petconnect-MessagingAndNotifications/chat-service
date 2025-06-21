const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/chatController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

// Enviar mensaje
router.post('/', authMiddleware, sendMessage);

// Obtener mensajes con un usuario
router.get('/:userId', authMiddleware, getMessages);

module.exports = router;
