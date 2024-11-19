import { error } from "console";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import {
  registerValidation,
  loginValidation,
  recipeCreateValidation,
} from "./validations.js";

import { userController, recipeController } from "./controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

mongoose
  .connect(process.env.MONGODB_URL)
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
