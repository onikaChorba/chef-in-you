import mongoose from "mongoose";
const RecipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    servings: Number,
    ingredients: {
      type: Array,
      default: [],
    },
    instructions: {
      type: Array,
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Recipe", RecipeSchema);
