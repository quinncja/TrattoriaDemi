const express = require("express");
const reservationRouter = express.Router();
const Reservation = require("./Reservation");
const { sendResText } = require('./sendResText')
const { reservationChecker } = require('./reservationChecker'); 

// Create new reservation
reservationRouter.post("/", async (req, res) => {
  try {
    const { name, numGuests, date, time, notes, phone, tableSize, sendText } = req.body;
    const newReservation = new Reservation({
      name,
      numGuests,
      date,
      time,
      notes,
      phone,
      tableSize
    });
    const response = await reservationChecker(numGuests, date, time)
    if(response.available){
      await newReservation.save();
      if(sendText) await sendResText(newReservation);
      res.status(201).json(newReservation);
    }
    else{
      res.status(500).json({ error: "Availability error" });
    }
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get list of reservations
reservationRouter.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get reservation by id
reservationRouter.get("/id/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json(reservation);
  } catch (error) {
    console.error("Error fetching reservation by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete reservation by id
reservationRouter.delete("/id/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;

    // Use Mongoose's findByIdAndRemove method to delete the reservation by ID
    const deletedReservation =
      await Reservation.findByIdAndRemove(reservationId);

    if (!deletedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get reservations by date
reservationRouter.get("/date/:date", async (req, res) => {
  try {
    const targetDate = new Date(req.params.date); 
    // Construct the start and end of the day for the target date
    const startOfDay = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), 0, 0, 0, 0));
  
    // Query for reservations within the day range
    const reservations = await Reservation.find({ date: startOfDay });

    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations by date:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Patch reservation state by id
reservationRouter.patch("/id/:id/state/:state", async (req, res) => {
  try {
    const [reservationId, newState] = [req.params.id, req.params.state];

    const lowercaseState = newState.toLowerCase();

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { state: lowercaseState },
      { new: true },
    );

    if (!updatedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation state:", error);
    res.status(500).json({ error: "Server error" });
  }
});

reservationRouter.get("/check", async (req, res) => {
  const numGuests = req.query.numGuests;
  const date = req.query.date;
  const time = req.query.time;

  const response = await reservationChecker(numGuests, date, time)

  res.status(200).json(response);
});

module.exports = reservationRouter;
