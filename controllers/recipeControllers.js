import RecipeModel from "../models/recipe.js";
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
