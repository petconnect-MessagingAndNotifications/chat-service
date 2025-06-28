const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { sendMessage, getMessages } = require('../controllers/chatController');

const router = express.Router();

/**
 * @route POST /api/chat/
 * @desc Enviar un mensaje
 */
router.post(
  '/',
  authMiddleware,
  [
    body('receiverId').notEmpty().withMessage('Receiver ID is required'),
    body('message').isString().withMessage('Message must be a string'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    sendMessage(req, res);
  }
);

/**
 * @route GET /api/chat/:userId
 * @desc Obtener conversación con otro usuario
 */
router.get('/:userId', authMiddleware, getMessages);

module.exports = router;
