
import express from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const TICKET_PRICE = 200;

// Book seats
router.post("/", auth, async (req, res) => {
  try {
    const { movieId, showtime, seats } = req.body;

    if (
      !mongoose.isValidObjectId(movieId) ||
      !showtime ||
      !Array.isArray(seats) ||
      seats.length === 0 ||
      seats.some((seat) => typeof seat !== "string" || !seat.trim()) ||
      new Set(seats).size !== seats.length
    ) {
      return res.status(400).json({
        message: "Provide a valid movie, showtime, and unique seats.",
      });
    }

    const selectedShowtime = new Date(showtime);

    if (Number.isNaN(selectedShowtime.getTime())) {
      return res.status(400).json({
        message: "Invalid showtime.",
      });
    }

    const movie = await Movie.findOne({
      _id: movieId,
      isActive: true,
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    const scheduled = movie.showtimes.some(
      (time) => time.getTime() === selectedShowtime.getTime()
    );

    if (!scheduled) {
      return res.status(400).json({
        message: "This showtime is not available for the movie.",
      });
    }

    // Use a transaction to prevent two users booking the same seats.
    const session = await mongoose.startSession();
    let booking;

    try {
      await session.withTransaction(async () => {
        const alreadyBooked = await Booking.findOne({
          movie: movieId,
          showtime: selectedShowtime,
          status: "confirmed",
          seats: { $in: seats },
        }).session(session);

        if (alreadyBooked) {
          const error = new Error("One or more seats are already booked.");
          error.status = 409;
          throw error;
        }

        [booking] = await Booking.create(
          [
            {
              user: req.user.id,
              movie: movieId,
              showtime: selectedShowtime,
              seats,
              totalAmount: seats.length * TICKET_PRICE,
            },
          ],
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    res.status(201).json({
      message: "Booking confirmed!",
      booking,
    });
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({ message: error.message });
    }

    console.error("Booking error:", error.message);
    res.status(500).json({
      message: "Booking failed. Please try again.",
    });
  }
});

// Get the logged-in user's bookings
router.get("/my", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate("movie", "title posterUrl duration")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error.message);
    res.status(500).json({
      message: "Failed to fetch bookings.",
    });
  }
});

export default router;
