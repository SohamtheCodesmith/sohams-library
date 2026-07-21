import { Router } from "express";
import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import Book from "../models/Books";

const router = Router();
let context = "";

// LLM
const llm = new ChatOllama({
  model: "gemma4",
});

// Tool to fetch book details
const getBookDetailsTool = new DynamicStructuredTool({
  name: "get_book_details",
  description: "Fetches detailed information about a specific book including its synopsis. Use this when a user asks for more details, a summary, or information about a specific book.",
  schema: z.object({
    bookId: z.string().describe("The MongoDB _id of the book to fetch details for"),
  }),
  func: async ({ bookId }) => {
    try {
      const response = await fetch(`http://localhost:5000/book/${bookId}`);
      if (!response.ok) {
        return `Error: Could not fetch details for book with ID ${bookId}`;
      }
      const bookData = await response.json();
      return JSON.stringify({
        title: bookData.title,
        author: bookData.author,
        synopsis: bookData.synopsis,
      });
    } catch (error) {
      return `Error fetching book details: ${error}`;
    }
  },
});

// Bind the tool to the LLM
const llmWithTools = llm.bindTools([getBookDetailsTool]);

// Prompt template
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful library assistant. 
    You must consider the following list of books currently available in the library:
    {book_list}
    
    When a user asks about a specific book in detail, use the get_book_details tool to fetch its synopsis.
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

    // Fetch books from MongoDB with their IDs
    const books = await Book.find({});
    const bookList =
      books.length === 0
        ? "No books currently available."
        : books
            .map(
              (b) => `• ${b.title} by ${b.author} (ID: ${b._id})`
            )
            .join("\n");

    // Pipe prompt → LLM with tools
    const chain = prompt.pipe(llmWithTools);
    
    let response = "";
    const stream = await chain.stream({
      context,
      question: userMessage,
      book_list: bookList
    });

    for await (const chunk of stream) {
      // Check if the model is calling a tool
      if (chunk.tool_calls && chunk.tool_calls.length > 0) {
        for (const toolCall of chunk.tool_calls) {
          if (toolCall.name === "get_book_details") {
            // Execute the tool
            const toolResult = await getBookDetailsTool.invoke({ bookId: toolCall.args.bookId });
            
            // Create a follow-up prompt with the tool result
            const followUpChain = prompt.pipe(llm);
            const followUpStream = await followUpChain.stream({
              context: context + `\nTool result: ${toolResult}`,
              question: `Based on this book information: ${toolResult}, please provide a helpful response to the user's question: "${userMessage}"`,
              book_list: bookList
            });

            for await (const followUpChunk of followUpStream) {
              response += followUpChunk.content;
            }
          }
        }
      } else {
        response += chunk.content;
      }
    }

    context += `User: ${userMessage}\nAI: ${response}\n`;
    return res.json({ reply: response });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;