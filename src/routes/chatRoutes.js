const express = require('express');
const { body, validationResult } = require('express-validator');
const ChatMessage = require('../models/ChatMessage');
const router = express.Router();

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Crear un nuevo mensaje
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender:
 *                 type: string
 *               receiver:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mensaje creado exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post(
  '/',
  [
    body('sender').notEmpty().withMessage('Sender es requerido'),
    body('receiver').notEmpty().withMessage('Receiver es requerido'),
    body('message').isString().withMessage('Message debe ser un string'),
  ],
  async (req, res) => {
    console.log('📨 POST /messages recibido:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('❌ Error de validación:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newMsg = new ChatMessage(req.body);
      await newMsg.save();
      console.log('✅ Mensaje guardado en la DB:', newMsg);
      res.status(201).json(newMsg);
    } catch (err) {
      console.error('❌ Error al guardar mensaje:', err.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

module.exports = router;
