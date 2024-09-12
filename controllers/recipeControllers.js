import RecipeModel from "../models/recipe.js";

export const getAll = async (req, res) => {
  try {
    const recipes = await RecipeModel.find().populate("user").exec();
    res.json(recipes);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Recipes are not found",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await RecipeModel.findOneAndUpdate(
      { _id: recipeId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: "after" }
    ).exec();

    if (!recipe) {
      return res.status(404).json({ message: "Recipe is not found" });
    }

    res.json(recipe);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Recipes are not found",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new RecipeModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const recipe = await doc.save();

    res.json(recipe);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Recipe is not created",
    });
  }
};
