const express = require('express');
const messageRouter = express.Router();
const Message = require('./Message'); 

// Create new Contact
messageRouter.post('/', async (req, res) => {
    try{
        console.log('Received request body:', req.body);
        const { name, message, email } = req.body;
        const newMessage = new Message({name, message, email})
        await newMessage.save();
        res.status(201).json(newMessage)
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Server error' });
    }
})

messageRouter.delete('/id/:id', async (req, res) => {
    try {
      const messageId = req.params.id;
  
      const deletedMessage = await Reservation.findByIdAndRemove(messageId);
  
      if (!deletedMessage) {
        return res.status(404).json({ error: 'Message not found' });
      }
  
      res.json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error('Error deleting reservation by ID:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
module.exports = messageRouter;
