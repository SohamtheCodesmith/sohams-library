interface SidebarProps {
  genres: string[];
  onSelectGenre: (genre: string) => void;
  collapsed: boolean;
  toggleCollapsed: () => void;
}

export default function Sidebar({ genres, onSelectGenre, collapsed, toggleCollapsed }: SidebarProps) {
  if (collapsed) {
    return (
      <aside className="col-1 d-flex flex-column justify-content-end border-end">
        <button className="btn btn-light" onClick={toggleCollapsed}>
          ≫
        </button>
      </aside>
    );
  }

  return (
    <aside className="col-3 p-3 border-end d-flex flex-column">
      <h2 className="fw-bold mb-3">Genres</h2>
      <ul className="list-unstyled flex-grow-1">
        <li>
          <button onClick={() => onSelectGenre("")} className="btn btn-link p-0">
            All
          </button>
        </li>
        {genres.map((genre) => (
          <li key={genre}>
            <button onClick={() => onSelectGenre(genre)} className="btn btn-link p-0">
              {genre}
            </button>
          </li>
        ))}
      </ul>
      <div className="text-center mt-auto">
        <button className="btn btn-light" onClick={toggleCollapsed}>
          ≪
        </button>
      </div>
    </aside>
  );
}