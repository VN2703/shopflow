'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/view-all`
      );
      const data = await response.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string) => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, quantity: 1 }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessage('Added to cart! ✅');
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/delete/${productId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessage('Product deleted! ✅');
        fetchProducts();
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">🛍️ All Products</h1>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <Link href="/products/add">
              <button className="bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600 font-medium">
                ➕ Add Product
              </button>
            </Link>
          )}
        </div>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 text-center font-medium">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl shadow p-5 flex flex-col">

              <div className="w-full h-36 bg-blue-50 rounded-xl flex items-center justify-center text-5xl mb-4">
                📦
              </div>

              <div className="flex justify-between items-start mb-1">
                <h2 className="text-lg font-bold text-black">{product.name}</h2>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  product.stock > 10
                    ? 'bg-green-100 text-green-700'
                    : product.stock > 0
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                </span>
              </div>

              <p className="text-blue-500 text-xs font-medium mb-2">{product.category}</p>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
              <p className="text-2xl font-bold text-blue-600 mb-4">₹{product.price.toLocaleString()}</p>

              {/* Customer — Add to Cart */}
              {(!user || user?.role === 'customer') && (
                <button
                  onClick={() => addToCart(product._id)}
                  disabled={product.stock === 0}
                  className="w-full bg-blue-500 text-white py-2.5 rounded-xl hover:bg-blue-600 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  🛒 Add to Cart
                </button>
              )}

              {/* Admin / Manager — Edit and Delete */}
              {(user?.role === 'admin' || user?.role === 'manager') && (
                <div className="flex gap-2">
                  <Link href={`/products/update/${product._id}`} className="flex-1">
                    <button className="w-full bg-green-400 text-white py-2.5 rounded-xl font-medium">
                       Edit
                    </button>
                  </Link>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="flex-1 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 font-medium"
                    >
                       Delete
                    </button>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center mt-20">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-gray-400 text-xl">No products available!</p>
          </div>
        )}

      </div>
    </div>
  );
}