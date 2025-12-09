import Book from "../models/Books";

export const getAllBooks = async (req: any, res: any) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

export const addBook = async (req: any, res: any) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.json(newBook);
  } catch (err) {
    res.status(400).json({ error: "Failed to add book" });
  }
};