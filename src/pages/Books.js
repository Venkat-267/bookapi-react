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
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
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
      console.error("Error saving book:", err);
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
        console.error("Error deleting book:", err);
        alert("Failed to delete.");
      }
    }
  };

  const handleCancel = () => {
    setBookForm(initialBookState);
    setEditingISBN(null);
  };

  // Check if current user is Admin
  const isAdmin = user?.Role === "Admin";

  return (
    <div className="container mt-4 fade-in">
      <div className="page-header">
        <h1 className="page-title">
          📚 Book Management
        </h1>
        <p className="page-subtitle">
          Manage your book collection with ease
          {user && (
            <span className="ms-2">
              | Logged in as: <strong>{user.Role}</strong>
            </span>
          )}
        </p>
      </div>

      {/* Only show form for Admin users */}
      {isAdmin && (
        <div className="book-form bounce-in">
          <h2 className="form-section-title">
            {editingISBN ? "📝 Update Book" : "➕ Add New Book"}
          </h2>
          <form onSubmit={handleAddOrUpdate}>
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">ISBN</label>
                <input
                  type="text"
                  name="ISBN"
                  className="form-control"
                  placeholder="Enter ISBN"
                  value={bookForm.ISBN}
                  onChange={handleChange}
                  disabled={editingISBN !== null}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="Title"
                  className="form-control"
                  placeholder="Enter book title"
                  value={bookForm.Title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  name="Author"
                  className="form-control"
                  placeholder="Enter author name"
                  value={bookForm.Author}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-2 mb-3">
                <label className="form-label">Year</label>
                <input
                  type="number"
                  name="PublicationYear"
                  className="form-control"
                  placeholder="Year"
                  value={bookForm.PublicationYear}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-1 mb-3 d-flex flex-column">
                <label className="form-label">&nbsp;</label>
                <div className="action-buttons">
                  <button
                    type="submit"
                    className={`btn btn-${editingISBN ? "warning" : "primary"} w-100`}
                  >
                    {editingISBN ? "Update" : "Add"}
                  </button>
                  {editingISBN && (
                    <button
                      type="button"
                      className="btn btn-secondary w-100 mt-2"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="books-section slide-in">
        <div className="books-header">
          <h3 className="books-title">📖 Books Library</h3>
          <div className="books-count">
            {books.length} {books.length === 1 ? 'Book' : 'Books'}
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>📖 ISBN</th>
                <th>📚 Title</th>
                <th>✍️ Author</th>
                <th>📅 Year</th>
                <th>⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      <div className="empty-state-icon">📚</div>
                      <div className="empty-state-title">No books found</div>
                      <div className="empty-state-description">
                        {isAdmin 
                          ? "Start by adding your first book to the collection"
                          : "No books available in the library at the moment"
                        }
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.ISBN} className={editingISBN === book.ISBN ? 'table-warning' : ''}>
                    <td><strong>{book.ISBN}</strong></td>
                    <td>{book.Title}</td>
                    <td>{book.Author}</td>
                    <td>{book.PublicationYear}</td>
                    <td>
                      {isAdmin ? (
                        <div className="action-buttons">
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleEdit(book)}
                            disabled={editingISBN === book.ISBN}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(book.ISBN)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted">
                          <small>👁️ View Only</small>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Books;