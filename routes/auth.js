const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const _ = require("lodash");

const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ errorMessage: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ errorMessage: "Invalid email or password." });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({ errorMessage: "Invalid email or password." });

  const token = user.generateAuthToken();
  return res.status(200).json({ jwt: token });
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(4).max(255).required(),
  });

  return schema.validate(req);

}

module.exports = router;
