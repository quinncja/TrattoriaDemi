const express = require('express');
const reservationRouter = express.Router();
const Reservation = require('./Reservation');

// Create new reservation
reservationRouter.post('/', async (req, res) => {   
  try {
    const { name, numGuests, date, time, notes } = req.body;
    const newReservation = new Reservation({name, numGuests, date, time, notes });
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get list of reservations
reservationRouter.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get reservation by id
reservationRouter.get('/id/:id', async (req, res) => {
    try {
      const reservationId = req.params.id;
  
      const reservation = await Reservation.findById(reservationId);
  
      if (!reservation) {
        return res.status(404).json({ error: 'Reservation not found' });
      }
        res.json(reservation);
    } catch (error) {
      console.error('Error fetching reservation by ID:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Delete reservation by id
reservationRouter.delete('/id/:id', async (req, res) => {
    try {
      const reservationId = req.params.id;
  
      // Use Mongoose's findByIdAndRemove method to delete the reservation by ID
      const deletedReservation = await Reservation.findByIdAndRemove(reservationId);
  
      if (!deletedReservation) {
        return res.status(404).json({ error: 'Reservation not found' });
      }
  
      res.json({ message: 'Reservation deleted successfully' });
    } catch (error) {
      console.error('Error deleting reservation by ID:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Get reservations by date
  reservationRouter.get('/date/:date', async (req, res) => {
    try {
      const targetDate = new Date(req.params.date);
      
      // Use Mongoose's find method to query reservations by the 'datetime' field
      const reservations = await Reservation.find({ date: targetDate });
      
      res.json(reservations);
    } catch (error) {
      console.error('Error fetching reservations by date:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Patch reservation state by id
  reservationRouter.patch('/id/:id/state/:state', async (req, res) => {
    try {
      const [reservationId, newState] = [req.params.id, req.params.state];
  
      const lowercaseState = newState.toLowerCase();
        if (!validStates.includes(lowercaseState)) {
        return res.status(400).json({ error: 'Invalid state' });
      }
  
      const updatedReservation = await Reservation.findByIdAndUpdate(
        reservationId,
        { state: lowercaseState },
        { new: true }
      );
  
      if (!updatedReservation) {
        return res.status(404).json({ error: 'Reservation not found' });
      }
  
      res.json(updatedReservation);
    } catch (error) {
      console.error('Error updating reservation state:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });



module.exports = reservationRouter;
