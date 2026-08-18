import { FormEvent, useEffect, useMemo, useState } from "react";
import axios from "axios";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
};

const api = axios.create({
  baseURL: "/api",
});

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalProducts = useMemo(() => products.length, [products]);
  const totalValue = useMemo(() => {
    return products.reduce((sum, product) => sum + product.price, 0);
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<Product[]>("/products");
      setProducts(response.data);
    } catch (err) {
      setError("Could not load products. Please check backend and database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      await api.post("/products", {
        name,
        price: Number(price),
        category,
      });

      setName("");
      setPrice("");
      setCategory("");
      fetchProducts();
    } catch (err) {
      setError("Could not create product. Please check your input.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError("");
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError("Could not delete product.");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <header className="hero">
          <div>
            <p className="eyebrow">Docker Course Demo App</p>
            <h1>MERN Product Dashboard</h1>
            <p className="hero-text">
              This app is intentionally small so the course can stay focused on
              Docker, Compose, VPS deployment, and GitLab CI/CD.
            </p>
          </div>

          <div className="stats">
            <div className="stat-card">
              <span className="stat-label">Products</span>
              <strong>{totalProducts}</strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">Total Value</span>
              <strong>₹{totalValue.toLocaleString()}</strong>
            </div>
          </div>
        </header>

        <section className="grid">
          <div className="card">
            <h2>Add Product</h2>
            <p className="muted">
              Add a few items to verify React → Express → MongoDB flow.
            </p>

            <form className="form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Product name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                min="0"
                required
              />

              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
              />

              <button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Add Product"}
              </button>
            </form>
          </div>

          <div className="card">
            <h2>Product List</h2>
            <p className="muted">
              Later in the course, this same app will run through Docker
              containers and Compose.
            </p>

            {loading ? (
              <div className="empty-state">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                No products yet. Add your first product from the form.
              </div>
            ) : (
              <div className="product-list">
                {products.map((product) => (
                  <div className="product-card" key={product._id}>
                    <div>
                      <h3>{product.name}</h3>
                      <p>{product.category}</p>
                    </div>

                    <div className="product-meta">
                      <strong>₹{product.price.toLocaleString()}</strong>
                      <button
                        className="danger-button"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {error ? <div className="error-box">{error}</div> : null}
      </div>
    </div>
  );
}
