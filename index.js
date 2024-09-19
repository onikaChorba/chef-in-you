import { error } from "console";
import express from "express";
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
  recipeCreateValidation,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import * as userController from "./controllers/userController.js";
import * as recipeController from "./controllers/recipeControllers.js";

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

app.post("/registration", registerValidation, userController.register);
app.post("/login", loginValidation, userController.login);
app.get("/me", checkAuth, userController.getMe);

app.get("/recipes", recipeController.getAll);
app.get("/recipes/:id", recipeController.getOne);
app.post(
  "/recipes",
  checkAuth,
  recipeCreateValidation,
  recipeController.create
);
app.delete("/recipes/:id", checkAuth, recipeController.remove);
app.patch("/recipes/:id", checkAuth, recipeController.update);

app.listen(8000, (err) => {
  if (err) {
    console.log(err);
  }

  console.log("Server OK");
});
