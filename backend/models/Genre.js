import mongoose from "mongoose";

const genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,

      
      required: [true, "Genre name is required"],

   
      minlength: [3, "Genre name must be at least 3 characters long"],
      maxlength: [32, "Genre name must be less than 32 characters"],


      match: [
        /^[a-zA-Z0-9 ]+$/,
        "Genre name must contain only letters and numbers",
      ],

      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);


genreSchema.index({ name: 1 });

export default mongoose.model("Genre", genreSchema);
