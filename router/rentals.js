const express = require("express");
const mongoose = require("mongoose");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const { Rental, validate } = require("../models/rental");
const router = express.Router();

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rentals = await Rental.findById(req.params.id).sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId).session(session);
    if (!customer) return res.send("Invalid customer.");

    const movie = await Movie.findById(req.body.movieId).session(session);
    if (!movie) return res.send("Invalid movie.");
    if (movie.numberInStock === 0) return res.status(400).send("Movie not in stock.");

    const rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });
    await rental.save({ session });

    movie.numberInStock--;
    await movie.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.send(rental);

  } catch (error) {
    console.log("Error: ", error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).send("Something failed.");
  }
});


module.exports = router;
