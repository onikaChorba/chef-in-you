import { error } from "console";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import {
  registerValidation,
  loginValidation,
  recipeCreateValidation,
} from "./validations.js";

import { userController, recipeController } from "./controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

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
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hi user");
});

app.get("/registration", (req, res) => {
  res.send("Hi user, registration");
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

app.listen(8000, (err) => {
  if (err) {
    console.log(err);
  }

  console.log("Server OK");
});
