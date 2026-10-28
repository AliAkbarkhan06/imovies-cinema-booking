
import express from "express";
import Movie from "../models/Movie.js";

const router = express.Router();

// Get all active movies
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find({ isActive: true })
      .sort({ createdAt: -1 });
      console.log("Movies from database:", JSON.stringify(movies, null, 2));

    res.json(movies);
  } catch (error) {
    console.error("Fetch movies error:", error.message);
    res.status(500).json({ message: "Failed to fetch movies" });
  }
});

// Get a single movie by ID
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.json(movie);
  } catch (error) {
    res.status(400).json({
      message: "Invalid movie ID",
    });
  }
});

export default router;
