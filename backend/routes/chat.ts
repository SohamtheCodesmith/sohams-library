import { Router } from "express";
import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import Book from "../models/Books";

const router = Router();

let context = "";

// LLM
const llm = new ChatOllama({
  model: "gemma3:4b",
});

// Prompt template
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful library assistant. 
    You must consider the following list of books currently available in the library:

    {book_list}

    Answer the user's questions based only on these books.`
  ],
  [
    "human",
    "Conversation so far:\n{context}\n\nUser message:\n{question}"
  ]
]);

router.post("/", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 👉 Fetch books from MongoDB
    const books = await Book.find({});
    const bookList =
      books.length === 0
        ? "No books currently available."
        : books
            .map(
              (b) => `• ${b.title} by ${b.author}`
            )
            .join("\n");

    // Pipe prompt → LLM
    const chain = prompt.pipe(llm);

    let response = "";

    const stream = await chain.stream({
      context,
      question: userMessage,
      book_list: bookList
    });

    for await (const chunk of stream) {
      response += chunk.content;
    }

    context += `User: ${userMessage}\nAI: ${response}\n`;

    return res.json({ reply: response });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;