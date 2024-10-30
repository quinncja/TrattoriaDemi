
const express = require("express");
const reservationRouter = express.Router();
const Reservation = require("./Reservation");
const { sendResText } = require("./sendResText");
const { sendUpdatedResText } = require("./sendUpdatedResText");
const { reservationChecker } = require("./reservationChecker");
let clients = [];

// Create new reservation
reservationRouter.post("/", async (req, res) => {
  try {
    const { name, numGuests, date, time, notes, phone, tableSize, sendText } =
      req.body;
    const newReservation = new Reservation({
      name,
      numGuests,
      date,
      time,
      notes,
      phone,
      tableSize,
      sendText,
    });
    const response = await reservationChecker(numGuests, date, time);
    if (response.available) {
      await newReservation.save();
      if (sendText) await sendResText(newReservation);
      // Notify all connected clients
      clients.forEach((client) =>
        client.write(`data: ${JSON.stringify(newReservation)}\n\n`),
      );

      res.status(201).json(newReservation);
    } else {
      res.status(500).json({ error: "Availability error" });
    }
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Server error" });
  }
});

reservationRouter.get("/events", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  clients.push(res);
  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
  });
});

reservationRouter.post("/override", async (req, res) => {
  try {
    const { name, numGuests, date, time, notes, phone, tableSize, sendText } =
      req.body;
    const newReservation = new Reservation({
      name,
      numGuests,
      date,
      time,
      notes,
      phone,
      tableSize,
      selfMade: true,
    });
    await newReservation.save();
    if (sendText) await sendResText(newReservation);
    res.status(201).json(newReservation);
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

function sortReservationsByTime(reservations) {
  return reservations.sort((a, b) => {
    // Split the time strings into [hour, minute]
    const [hourA, minuteA] = a.time.split(":").map(Number);
    const [hourB, minuteB] = b.time.split(":").map(Number);

    // Compare the hours first
    if (hourA !== hourB) {
      return hourA - hourB;
    }

    // If hours are the same, compare the minutes
    return minuteA - minuteB;
  });
}

// Get reservations by date
reservationRouter.get("/date/:date", async (req, res) => {
  try {
    const targetDate = new Date(req.params.date);
    // Construct the start and end of the day for the target date
    const startOfDay = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );

    // Query for reservations within the day range
    let reservations = await Reservation.find({ date: startOfDay });
    reservations = sortReservationsByTime(reservations);
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations by date:", error);
    res.status(500).json({ error: "Server error" });
  }
});

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

reservationRouter.patch("/id/:id/state/:state", async (req, res) => {
  try {
    const [reservationId, newState] = [req.params.id, req.params.state];

    const lowercaseState = newState.toLowerCase();
    let arrivedTime = "";
    if (lowercaseState === "arrived") {
      arrivedTime = getCurrentTime();
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { state: lowercaseState, arrivedTime: arrivedTime },
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

  const response = await reservationChecker(numGuests, date, time);

  res.status(200).json(response);
});

module.exports = reservationRouter;


// Update reservation by id
reservationRouter.put("/id/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const updatedData = req.body;

    const existingReservation = await Reservation.findById(reservationId);

    if (!existingReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }


    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      updatedData,
      { new: true }
    );

    if (existingReservation.sendText) {
        await sendUpdatedResText(updatedReservation);
    }

    clients.forEach((client) =>
      client.write(`data: ${JSON.stringify(updatedReservation)}\n\n`)
    );

    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ error: "Server error" });
  }
});



reservationRouter.get("/stats", async (req, res) => {
  try {
    const startOfUTCDay = (date) => {
      return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
    };

    const endOfUTCDay = (date) => {
      return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
    };

    const startOfUTCMonth = (date) => {
      return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
    };

    const endOfUTCMonth = (date) => {
      return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1, 0, 0, 0, 0) - 1);
    };

    const startOfUTCYear = (date) => {
      return new Date(Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
    };

    const endOfUTCYear = (date) => {
      return new Date(Date.UTC(date.getUTCFullYear() + 1, 0, 1, 0, 0, 0, 0) - 1);
    };

    const now = new Date();

    const todayStart = startOfUTCDay(now);
    const todayEnd = endOfUTCDay(now);

    const monthStart = startOfUTCMonth(now);
    const monthEnd = endOfUTCMonth(now);

    const yearStart = startOfUTCYear(now);
    const yearEnd = endOfUTCYear(now);

    const getStats = async (startDate, endDate) => {
      const stats = await Reservation.aggregate([
        {
          $match: {
            date: {
              $gte: startDate,
              $lte: endDate,
            },
            state: { $ne: "cancel" }
          },
        },
        {
          $group: {
            _id: "$numGuests",
            count: { $sum: 1 },
            totalGuests: { $sum: "$numGuests" },
          },
        },
        {
          $group: {
            _id: null,
            reservationCount: { $sum: "$count" },
            totalGuests: { $sum: "$totalGuests" },
            guestCounts: {
              $push: {
                k: { $toString: "$_id" },
                v: "$count",
              },
            },
          },
        },
        {
          $addFields: {
            guestCounts: { $arrayToObject: "$guestCounts" },
          },
        },
        {
          $project: {
            _id: 0,
            reservationCount: 1,
            totalGuests: 1,
            guestCounts: 1,
          },
        },
      ]);

      const initializedGuestCounts = {};
      for (let i = 1; i <= 25; i++) {
        initializedGuestCounts[i.toString()] = 0;
      }

      if (stats.length > 0) {
        Object.assign(initializedGuestCounts, stats[0].guestCounts);

        const guestCountsArray = Object.entries(initializedGuestCounts)
        .map(([numGuests, count]) => ({
          numGuests,
          count,
        }))
        .filter(entry => entry.count > 0);

        return {
          reservationCount: stats[0].reservationCount,
          totalGuests: stats[0].totalGuests,
          guestCounts: guestCountsArray,
        };
      } else {
        const guestCountsArray = Object.entries(initializedGuestCounts).map(([numGuests, count]) => ({
          numGuests,
          count,
        }));
        return {
          reservationCount: 0,
          totalGuests: 0,
          guestCounts: guestCountsArray,
        };
      }
    };

    const [todayStats, monthStats, yearStats] = await Promise.all([
      getStats(todayStart, todayEnd),
      getStats(monthStart, monthEnd),
      getStats(yearStart, yearEnd),
    ]);

    res.json({
      today: todayStats,
      month: monthStats,
      year: yearStats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = reservationRouter;
