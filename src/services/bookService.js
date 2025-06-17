import api from './api';

const bookService = {
  // 2.1 Get All Books
  getAllBooks: async () => {
    const response = await api.get('/api/Book/GetAllBooks');
    return response.data;
  },

  // 2.2 Get Book by ISBN
  getBookByISBN: async (isbn) => {
    const response = await api.get(`/api/Book/GetBookByISBN/${isbn}`);
    return response.data;
  },

  // 2.3 Add Book
  addBook: async (book) => {
    const response = await api.post('/api/Book/AddBook', book);
    return response.data;
  },

  // 2.4 Update Book
  updateBook: async (isbn, bookDto) => {
    const response = await api.put(`/api/Book/UpdateBook/${isbn}`, bookDto);
    return response.data;
  },

  // 2.5 Delete Book
  deleteBook: async (isbn) => {
    const response = await api.delete(`/api/Book/DeleteBook/${isbn}`);
    return response.data;
  },
};

export default bookService;
