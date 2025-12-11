import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bookRoutes from "./routes/books.ts";
import chatRouter from "./routes/chat";
import Book from "./models/Books";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/sohams_library")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Routes
app.use("/books", bookRoutes);
app.use("/chat", chatRouter);

// New endpoint for fetching a book’s synopsis
app.get("/book/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    return res.json({
      title: book.title,
      author: book.author,
      synopsis: book.synopsis || "No synopsis available."
    });
  } catch (err) {
    console.error("Book lookup error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Listen
app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});