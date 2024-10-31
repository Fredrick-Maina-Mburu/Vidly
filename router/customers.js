const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi")
const router = express.Router();

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    isGold: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    }
  })
);

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.send("The Customer with the given ID was not found");
  res.send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validateSchema(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
  });

  customer = await Customer.save()
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validateSchema(req.body);
  if (error) return res.send(error.details[0].message);

  const customer =  await Customer.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true})
  if (!customer) return res.send("The Customer with the given ID was not found");

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id)
  if (!customer) return res.send("The Customer with the given ID was not found");
  res.send(customer);
});

function validateSchema(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().min(5).max(50).required()
  });
  return schema.validate(customer);
}

module.exports = router;
