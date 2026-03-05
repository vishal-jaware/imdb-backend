import mongoose from "mongoose";
import axios from "axios";
import movieModel from "./MODELS/moviesModel.js";
import dotenv from "dotenv"
dotenv.config();

console.log("Script Started...");

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function updatePosters() {
  console.log("Connecting to DB...");

  await mongoose.connect("mongodb://127.0.0.1:27017/MY-IMDB");

  console.log("DB Connected...");

  const movies = await movieModel.find();
  console.log("Total movies found:", movies.length);

  for (let movie of movies) {
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/search/movie",
        {
          params: {
            api_key: TMDB_API_KEY,
            query: movie.Series_Title,
            year: movie.Released_Year,
          },
        }
      );

      if (response.data.results.length > 0) {
        const posterPath = response.data.results[0].poster_path;
        const posterUrl = `https://image.tmdb.org/t/p/original${posterPath}`;

        await movieModel.findByIdAndUpdate(movie._id, {
          Poster_Link: posterUrl,
        });

        console.log("Updated:", movie.Series_Title);
      } else {
        console.log("Not found:", movie.Series_Title);
      }
    } catch (err) {
  console.log("Error:", movie.Series_Title);
  console.log("Status:", err.response?.status);
  console.log("Message:", err.response?.data || err.message);
}
  }

  mongoose.disconnect();
  console.log("Finished updating.");
}

updatePosters();