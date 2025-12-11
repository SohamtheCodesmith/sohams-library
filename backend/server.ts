import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bookRoutes from "./routes/books.ts";
import chatRouter from "./routes/chat";

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

// Listen
app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});