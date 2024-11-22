import RecipeModel from "../models/recipe.js";

export const getLastTags = async (req, res) => {
  try {
    const recipes = await RecipeModel.find().limit(5).exec();

    const tags = recipes
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json({ tags });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Tags are not found",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const recipes = await RecipeModel.find().populate("user").exec();

    if (!recipes || recipes.length === 0) {
      return res.status(404).json({
        message: "No recipes found",
      });
    }

    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error.message);
    console.error(error.stack);

    if (error.name === "MongoError") {
      return res.status(500).json({
        message: "Database connection error. Please try again later.",
      });
    }

    res.status(500).json({
      message: "An error occurred while fetching recipes.",
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

export const remove = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const doc = await RecipeModel.findOneAndDelete({ _id: recipeId });

    if (!doc) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Recipe is not deleted",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new RecipeModel({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      servings: req.body.servings,
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

export const update = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const doc = await RecipeModel.updateOne(
      { _id: recipeId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      }
    );
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Recipe is not updated",
    });
  }
};
