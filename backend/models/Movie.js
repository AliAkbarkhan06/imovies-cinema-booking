
import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: [String],
      default: [],
    },
    duration: {
      type: Number,
      required: true,
    },
    language: {
      type: String,
      default: "English",
    },
    releaseDate: {
      type: Date,
    },
    posterUrl: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    showtimes: [
      {
        type: Date,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
