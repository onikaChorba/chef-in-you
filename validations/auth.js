import { body } from "express-validator";

export const registerValidation = [
  body("email", "Invalid email address").isEmail(),
  body("password", "Password should be at least 5 simbol").isLength({ min: 5 }),
  body("fullName", "Full name should be at least 5 simbol").isLength({
    min: 5,
  }),
  body("avatarUrl", "Invalid avatar`s url").optional().isURL(),
];
