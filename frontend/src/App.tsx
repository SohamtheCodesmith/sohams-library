import { useEffect, useState } from "react";
import type { Book } from "./types";

// Loading Components
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import BookGrid from "./components/BookGrid";

export default function App() {

  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [booksData, setBooks] = useState<Book[]>([]);

  
  useEffect(() => {
  fetch("http://localhost:5000/books")
    .then(res => res.json())
    .then(data => setBooks(data))
    .catch(err => console.error("Failed to fetch books:", err));
  }, []);

  const genres = Array.from(new Set(booksData.map((b) => b.genre)));


  let filteredBooks: Book[] = booksData.filter((book) => {
    const matchesQuery = book.title.toLowerCase().includes(query.toLowerCase());
    const matchesGenre = selectedGenre ? book.genre === selectedGenre : true;
    return matchesQuery && matchesGenre;
  });

  // Sort by title
  filteredBooks.sort((a, b) =>
    sortOrder === "asc"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );

  let handleSortBooks = (e: any) => {
    setSortOrder(e.target.value)
  }

  return (
    <div className={`container-fluid ${darkMode ? "bg-dark text-light" : ""}`}>
      {/* Navbar */}
      <nav className={`navbar ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}>
        <div className="container-fluid d-flex justify-content-between">
          <span className="navbar-brand">📚 Soham's Library</span>
          <div className="d-flex align-items-center">
            {/* Sort */}
            <div className="dropdown me-3">
              <select onChange={handleSortBooks}>
                <option value={'asc'}>A-Z</option>
                <option value={'desc'}>Z-A</option>
              </select>
            </div>
            {/* Dark mode slider */}
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="darkModeSwitch"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <label className="form-check-label" htmlFor="darkModeSwitch">
                Dark Mode
              </label>
            </div>
          </div>
        </div>
      </nav>

      {/* Main layout */}
      <div className="row vh-100">
          <Sidebar
            genres={genres}
            onSelectGenre={setSelectedGenre}
            collapsed={sidebarCollapsed}
            toggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        <main className="col p-4">
          <SearchBar query={query} setQuery={setQuery} />
          <BookGrid books={filteredBooks} />
        </main>
      </div>
    </div>
  );
}