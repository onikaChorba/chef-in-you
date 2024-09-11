import { error } from "console";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/user.js";
import checkAuth from "./utils/checkAuth.js";

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

app.get("/", (req, res) => {
  res.send("Hi user");
});

app.get("/registration", (req, res) => {
  res.send("Hi user, registration");
});

app.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );

    if (!isValidPass) {
      return res.status(403).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "Secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (error) {
    res.status(500).json({
      message: "authorization error",
    });
  }
});

app.post("/registration", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: hash,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "Secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to register",
    });
  }
});

app.get("/me", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User is not found",
      });
    }
    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "invalid access",
    });
  }
});

app.listen(8000, (err) => {
  if (err) {
    console.log(err);
  }

  console.log("Server OK");
});
