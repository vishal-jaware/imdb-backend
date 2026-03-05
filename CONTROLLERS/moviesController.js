import movieModel from "../MODELS/moviesModel.js";


//  GET ALL MOVIES 
let getMovies = async(req,res)=>{

try{

let page = parseInt(req.query.page) || 1
let limit = parseInt(req.query.limit) || 12
let search = req.query.search || ""

let query = {}

if(search){
query = {
$or:[
{Series_Title: {$regex: search, $options:"i"}},
{Director: {$regex: search, $options:"i"}},
{Genre: {$regex: search, $options:"i"}},
{Star1: {$regex: search, $options:"i"}},
{Star2: {$regex: search, $options:"i"}},
{Star3: {$regex: search, $options:"i"}},
{Star4: {$regex: search, $options:"i"}},
{Released_Year: {$regex: search, $options:"i"}}
]
}
}

let movies = await movieModel
.find(query)
.skip((page-1)*limit)
.limit(limit)

let total = await movieModel.countDocuments(query)

res.json({
movies,
totalPages: Math.ceil(total/limit),
currentPage:page,
totalMovies:total
})

}catch(error){
console.log(error)
res.status(500).json({message:"Error fetching movies"})
}

}

// GET SINGLE MOVIE 
let getSingleMovie = async (req, res) => {
  try {

    let movie = await movieModel.findById(req.params.id);

    res.status(200).json({ movie });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  TOP RATED
let getTopRated = async (req, res) => {
  try {

    let movies = await movieModel
      .find()
      .sort({ IMDB_Rating: -1 })
      .limit(10);

    res.status(200).json({ movies });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// ADMIN CONTROLLERS ============


//  ADD MOVIE
export const addMovie = async (req, res) => {
  console.log(req.body);

  try {

    const {
      Poster_Link,
      Series_Title,
      Released_Year,
      Certificate,
      Runtime,
      Genre,
      IMDB_Rating,
      Overview,
      Meta_score,
      Director,
      Star1,
      Star2,
      Star3,
      Star4,
      No_of_Votes,
      Gross
    } = req.body;

    let movie = await movieModel.create({
      Poster_Link,
      Series_Title,
      Released_Year,
      Certificate,
      Runtime,
      Genre,
      IMDB_Rating,
      Overview,
      Meta_score,
      Director,
      Star1,
      Star2,
      Star3,
      Star4,
      No_of_Votes,
      Gross
    });

    res.status(201).json({
      message: "Movie Added Successfully",
      movie
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding movie" });
  }

};



//  DELETE MOVIE
export const deleteMovie = async (req, res) => {

  try {

    const { id } = req.params;

    await movieModel.findByIdAndDelete(id);

    res.json({
      message: "Movie Deleted Successfully"
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Error deleting movie" });

  }

};



//  UPDATE MOVIE
export const updateMovie = async (req, res) => {

  try {

    const { id } = req.params;

    const movie = await movieModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Movie Updated Successfully",
      movie
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Error updating movie" });

  }

};



//  EXPORT
export {
  getMovies,
  getSingleMovie,
  getTopRated
};