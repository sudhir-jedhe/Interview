import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Book {
  id: number;
  title: string;
  author: string;
}

const API_URL = 'http://localhost:3000/api/v1';

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newBook, setNewBook] = useState({ title: '', author: '' });
  const [token, setToken] = useState('');

  useEffect(() => {
    fetchBooks();
  }, [page]);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/books?page=${page}&limit=10`);
      setBooks(response.data.results);
    } catch (err) {
      setError('Error fetching books');
    }
    setLoading(false);
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/books`, newBook, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewBook({ title: '', author: '' });
      fetchBooks();
    } catch (err) {
      setError('Error creating book');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Book Library</h1>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter JWT token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="border p-2 mr-2"
        />
      </div>

      <form onSubmit={handleCreateBook} className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Book
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul>
        {books.map((book) => (
          <li key={book.id} className="mb-2">
            {book.title} by {book.author}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-gray-300 p-2 rounded mr-2"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-300 p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;

