import mongoose from "mongoose";
let movieSchema = new mongoose.Schema({
  Poster_Link: String,
  Series_Title: String,
  Released_Year: String,
  Certificate: String,
  Runtime: String,
  Genre: String,
  IMDB_Rating: Number,
  Overview: String,
  Meta_score: Number,
  Director: String,
  Star1: String,
  Star2: String,
  Star3: String,
  Star4: String,
  No_of_Votes: Number,
  Gross: String
}, { timestamps: true,
     collection: "imdb-movies" 
 });

let movieModel = mongoose.model("MOVIE", movieSchema);

export default movieModel;