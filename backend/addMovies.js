import dotenv from "dotenv";
import mongoose from "mongoose";
import Movie from "./models/Movie.js";

dotenv.config();

const movies = [
  {
    title: "Inception",
    description:
      "A skilled thief enters people's dreams to steal secrets and faces his most challenging mission.",
    genre: ["Sci-Fi", "Action", "Thriller"],
    duration: 148,
    language: "English",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    rating: 8.8,
    showtimes: [
      new Date("2026-11-01T13:00:00.000Z"),
      new Date("2026-11-01T17:00:00.000Z"),
      new Date("2026-11-01T21:00:00.000Z"),
    ],
    isActive: true,
  },
  {
    title: "The Dark Knight",
    description:
      "Batman faces the Joker, a criminal mastermind who throws Gotham City into chaos.",
    genre: ["Action", "Crime", "Drama"],
    duration: 152,
    language: "English",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    rating: 9.0,
    showtimes: [
      new Date("2026-11-01T12:30:00.000Z"),
      new Date("2026-11-01T16:30:00.000Z"),
      new Date("2026-11-01T20:30:00.000Z"),
    ],
    isActive: true,
  },
  {
    title: "Avatar: The Way of Water",
    description:
      "Jake Sully and Neytiri protect their family while exploring the oceans of Pandora.",
    genre: ["Sci-Fi", "Adventure", "Fantasy"],
    duration: 192,
    language: "English",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    rating: 7.5,
    showtimes: [
      new Date("2026-11-01T11:00:00.000Z"),
      new Date("2026-11-01T15:00:00.000Z"),
      new Date("2026-11-01T19:00:00.000Z"),
    ],
    isActive: true,
  },
  {
    title: "Avengers: Endgame",
    description:
      "The Avengers assemble for one final battle to restore the universe.",
    genre: ["Action", "Adventure", "Sci-Fi"],
    duration: 181,
    language: "English",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
    rating: 8.4,
    showtimes: [
      new Date("2026-11-01T10:00:00.000Z"),
      new Date("2026-11-01T14:00:00.000Z"),
      new Date("2026-11-01T18:00:00.000Z"),
    ],
    isActive: true,
  },
  {
    title: "Interstellar",
    description:
      "A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars.",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    duration: 169,
    language: "English",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    rating: 8.7,
    showtimes: [
      new Date("2026-11-01T12:00:00.000Z"),
      new Date("2026-11-01T16:00:00.000Z"),
      new Date("2026-11-01T20:00:00.000Z"),
    ],
    isActive: true,
  },
  {
    title: "Dune: Part Two",
    description:
      "Paul Atreides joins Chani and the Fremen while seeking revenge against those who destroyed his family.",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    duration: 166,
    language: "English",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    rating: 8.5,
    showtimes: [
      new Date("2026-11-01T12:00:00.000Z"),
      new Date("2026-11-01T16:00:00.000Z"),
      new Date("2026-11-01T20:00:00.000Z"),
    ],
    isActive: true,
  },
  {
    title: "Spider-Man: No Way Home",
    description:
      "Peter Parker seeks help after his identity is revealed, but a dangerous spell changes everything.",
    genre: ["Action", "Adventure", "Fantasy"],
    duration: 148,
    language: "English",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    rating: 8.2,
    showtimes: [
      new Date("2026-11-01T13:00:00.000Z"),
      new Date("2026-11-01T17:00:00.000Z"),
      new Date("2026-11-01T21:00:00.000Z"),
    ],
    isActive: true,
  },
  {
    title: "Jurassic World",
    description:
      "A dinosaur theme park faces disaster when a genetically engineered dinosaur escapes.",
    genre: ["Action", "Adventure", "Sci-Fi"],
    duration: 124,
    language: "English",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/rhr4y79GpxQF9IsfJItRXVaoGs4.jpg",
    rating: 7.0,
    showtimes: [
      new Date("2026-11-01T11:00:00.000Z"),
      new Date("2026-11-01T15:00:00.000Z"),
      new Date("2026-11-01T19:00:00.000Z"),
    ],
    isActive: true,
  },
];

async function addMovies() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from your .env file.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully.");

    let added = 0;
    let skipped = 0;

    for (const movieData of movies) {
      const existingMovie = await Movie.findOne({
        title: movieData.title,
      });

      if (existingMovie) {
        console.log(`Skipped existing movie: ${movieData.title}`);
        skipped++;
        continue;
      }

      await Movie.create(movieData);
      console.log(`Added: ${movieData.title}`);
      added++;
    }

    const totalMovies = await Movie.countDocuments({
      isActive: true,
    });

    console.log("\n========== SUMMARY ==========");
    console.log(`New movies added: ${added}`);
    console.log(`Existing movies skipped: ${skipped}`);
    console.log(`Total active movies in database: ${totalMovies}`);
    console.log("==============================");
  } catch (error) {
    console.error("Error adding movies:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

addMovies();
