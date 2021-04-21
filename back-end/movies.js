const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 50000000
  }
});

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const movieSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  title: String,
  description: String,
  path: String,
  duration: String,
  genre: String,
  starring: String
});

const Movie = mongoose.model('Movie', movieSchema);

// upload photo
router.post("/", validUser, upload.single('posterImage'), async (req, res) => {
  // check parameters
  if (!req.file)
    return res.status(400).send({
      message: "Must upload a file."
    });

  const movie = new Movie({
    user: req.user,
    path: "/images/" + req.file.filename,
    title: req.body.title,
    genre: req.body.genre,
    duration: req.body.duration,
    starring: req.body.starring,
    description: req.body.description,
  });
  try {
    await movie.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get all movies
router.get("/all", async (req, res) => {
  try {
    let movies = await Movie.find().sort({
      created: -1
    }).populate('user');
    return res.send(movies);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get my movies
router.get("/", validUser, async (req, res) => {
  // return movies
  try {
    let movies = await Movie.find({
      user: req.user
    }).sort({
      created: -1
    }).populate('user');
    return res.send(movies);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

//Delete a Movie
router.delete('/:id', async (req, res) => {
  try {
    await Movie.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Edit an Item
router.put('/:id', async (req, res) => {

  try {
    let movie = await Movie.findOne({
      _id: req.params.id
    });
    movie.title = req.body.title;
    movie.genre = req.body.genre;
    movie.description = req.body.description;
    movie.starring = req.body.starring;
    movie.duration = req.body.duration;
    await movie.save();
    res.send(movie);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = {
  model: Movie,
  routes: router,
}
