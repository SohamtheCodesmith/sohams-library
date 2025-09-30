function SearchBar({ query, setQuery }: { query: string; setQuery: (q: string) => void }) {
  return (
    <input
      type="text"
      placeholder="Search by title..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="form-control mb-4"
    />
  );
}

export default SearchBar;