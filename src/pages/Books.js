import React, { useEffect, useState } from "react";
import bookService from "../services/bookService";
import { useAuth } from "../context/AuthContext";

const initialBookState = {
  ISBN: "",
  Title: "",
  Author: "",
  PublicationYear: "",
};

function Books() {
  const [books, setBooks] = useState([]);
  const [bookForm, setBookForm] = useState(initialBookState);
  const [editingISBN, setEditingISBN] = useState(null);
  const { logout } = useAuth();
  const { user } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (err) {
      alert("Session expired. Logging out.");
      logout();
    }
  };

  const handleChange = (e) => {
    setBookForm({ ...bookForm, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingISBN) {
        const { Title, Author, PublicationYear } = bookForm;
        await bookService.updateBook(editingISBN, {
          Title,
          Author,
          PublicationYear,
        });
      } else {
        await bookService.addBook(bookForm);
      }
      setBookForm(initialBookState);
      setEditingISBN(null);
      fetchBooks();
    } catch (err) {
      alert("Failed to save book.");
    }
  };

  const handleEdit = (book) => {
    setBookForm(book);
    setEditingISBN(book.ISBN);
  };

  const handleDelete = async (isbn) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookService.deleteBook(isbn);
        fetchBooks();
      } catch (err) {
        alert("Failed to delete.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{editingISBN ? "Update Book" : "Add Book"}</h2>
      <form className="card p-4 shadow mb-5" onSubmit={handleAddOrUpdate}>
        <div className="row">
          <div className="col-md-3 mb-3">
            <input
              type="text"
              name="ISBN"
              className="form-control"
              placeholder="ISBN"
              value={bookForm.ISBN}
              onChange={handleChange}
              disabled={editingISBN !== null}
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <input
              type="text"
              name="Title"
              className="form-control"
              placeholder="Title"
              value={bookForm.Title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <input
              type="text"
              name="Author"
              className="form-control"
              placeholder="Author"
              value={bookForm.Author}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <input
              type="number"
              name="PublicationYear"
              className="form-control"
              placeholder="Year"
              value={bookForm.PublicationYear}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-1 mb-3">
            <button
              type="submit"
              className={`btn btn-${editingISBN ? "warning" : "primary"} w-100`}
            >
              {editingISBN ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </form>

      <h4>Books List</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ISBN</th>
              <th>Title</th>
              <th>Author</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No books found.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.ISBN}>
                  <td>{book.ISBN}</td>
                  <td>{book.Title}</td>
                  <td>{book.Author}</td>
                  <td>{book.PublicationYear}</td>
                  <td>
                    {user?.Role === "Admin" && (
                      <>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => handleEdit(book)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(book.ISBN)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Books;
