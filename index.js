import { error } from "console";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/user.js";

mongoose
  .connect(
    "mongodb+srv://onika164604:79ngXzu7QaEWjUyS@cluster0.peb7u.mongodb.net/blog"
  )
  .then(() => {
    console.log("DB OK");
  })
  .catch(() => {
    console.log("DB error", error);
  });

const app = express();
app.use(express.json());

app.post("/registration", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHas = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHas,
      avatarUrl: req.body.avatarUrl,
    });

    const user = doc.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: "Failed to register",
    });
  }
});

app.listen(8000, (err) => {
  if (err) {
    console.log(err);
  }

  console.log("Server OK");
});
