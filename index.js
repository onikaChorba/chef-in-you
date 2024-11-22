import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import {
  registerValidation,
  loginValidation,
  recipeCreateValidation,
} from "./validations.js";

import { userController, recipeController } from "./controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://onika164604:79ngXzu7QaEWjUyS@cluster0.peb7u.mongodb.net/blog",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
};

connectDB();
const app = express();
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, filename, cb) => {
    cb(null, filename.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/registration", (req, res) => {
  res.send("");
});

app.post(
  "/registration",
  registerValidation,
  handleValidationErrors,
  userController.register
);
app.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  userController.login
);
app.get("/me", checkAuth, userController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/recipes", recipeController.getAll);
app.get("/recipes/tags", recipeController.getLastTags);
app.get("/recipes/:id", recipeController.getOne);
app.post(
  "/recipes",
  checkAuth,
  handleValidationErrors,
  recipeCreateValidation,
  recipeController.create
);
app.delete("/recipes/:id", checkAuth, recipeController.remove);
app.patch(
  "/recipes/:id",
  checkAuth,
  recipeCreateValidation,
  handleValidationErrors,
  recipeController.update
);

app.listen(process.env.PORT || 8000, (err) => {
  if (err) {
    console.log(err);
  }

  console.log("Server OK");
});
