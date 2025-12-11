import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  year: { type: Number },
  synopsis: { type: String },
  cover: { type: String }  // URL or filename
});

export default mongoose.model("Book", BookSchema);