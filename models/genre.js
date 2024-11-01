const mongoose = require("mongoose");
const Joi = require("joi")

const Genre = mongoose.model(
  "Genre",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
  })
);

function validateSchema(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
  });
  return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validateSchema;