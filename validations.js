import { body } from "express-validator";

export const registerValidation = [
  body("email", "Invalid email address").isEmail(),
  body("password", "Password should be at least 5 simbol").isLength({ min: 5 }),
  body("fullName", "Full name should be at least 5 simbol").isLength({
    min: 5,
  }),
  body("avatarUrl", "Invalid avatar`s url").optional().isURL(),
];

export const loginValidation = [
  body("email", "Invalid email address").isEmail(),
  body("password", "Password should be at least 5 simbol").isLength({ min: 5 }),
];

export const recipeCreateValidation = [
  body("title", "Input title recipe").isLength({ min: 5 }).isString(),
  //body("text", "Input text recipe").isLength({ min: 10 }).isString(),
  body("tags", "Invalid tag`s type").optional().isArray(),
  body("imgUrl", "Invalid image`s link").optional().isString(),
];
