const express = require("express");
const { Movie } = require("../models/movie");
const router = express.Router();
const { Customer } = require("../models/customer");
const { Rental, validate } = require("../models/rental");

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(renatla);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res.send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
    return res.send("Invalid movie.");

  if (movie.numberInStock === 0) return res.status(400).send("Movie not in stock.");

    let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    },
  });

  rental = await Rental.save();

  movie.numberInStock--;
  movie.save();

  res.send(rental);
});


module.exports = router;
