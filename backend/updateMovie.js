
import dotenv from "dotenv";
import mongoose from "mongoose";
import Movie from "./models/Movie.js";

dotenv.config();

const updateMovie = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully!");

    const movie = await Movie.findByIdAndUpdate(
      "6ae0c827cb79d2f71984450e",
      {
        $set: {
          showtimes: [
            new Date("2026-11-01T12:00:00.000Z"),
            new Date("2026-11-01T16:00:00.000Z"),
            new Date("2026-11-01T20:00:00.000Z"),
          ],
        },
      },
      { new: true, runValidators: true }
    );

    if (!movie) {
      console.log("Movie not found. Check the movie ID.");
      return;
    }

    console.log("Movie updated successfully!");
    console.log("Title:", movie.title);
    console.log("Showtimes:", movie.showtimes);
  } catch (error) {
    console.error("Update failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

updateMovie();
