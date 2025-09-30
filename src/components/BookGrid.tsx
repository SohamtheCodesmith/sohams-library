import type { Book } from "../types";

interface BookGridProps {
  books: Book[];
}

function BookGrid({ books }: BookGridProps) {
  return (
    <div className="row g-4">
      {books.map((book) => (
        <div key={book.isbn} className="col-md-4">
          <div className="card h-100">
            <img src={book.cover} alt={book.title} className="card-img-top" height="500" width="700" />
            <div className="card-body">
              <h5 className="card-title text-center">{book.title}</h5>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookGrid;