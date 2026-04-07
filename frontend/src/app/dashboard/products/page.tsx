'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function DashboardProductsPage() {
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
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🛍️ Products</h1>
          <p className="text-gray-500 text-sm">Manage your products</p>
        </div>
        <Link href="/dashboard/products/add">
          <button className="bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600 font-medium">
            ➕ Add Product
          </button>
        </Link>
      </div>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded-xl text-center font-medium">
          {message}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product._id} className="hover:shadow-md transition">
            <CardContent className="p-5">
              <div className="w-full h-28 bg-blue-50 rounded-xl flex items-center justify-center text-4xl mb-4">
                📦
              </div>

              <div className="flex justify-between items-start mb-1">
                <h2 className="font-bold text-lg">{product.name}</h2>
                <Badge variant="outline" className={
                  product.stock > 10
                    ? 'text-green-600 border-green-600'
                    : product.stock > 0
                    ? 'text-yellow-600 border-yellow-600'
                    : 'text-red-600 border-red-600'
                }>
                  Stock: {product.stock}
                </Badge>
              </div>

              <p className="text-blue-500 text-xs font-medium mb-2">{product.category}</p>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                ₹{product.price.toLocaleString()}
              </p>

              <div className="flex gap-2">
                <Link href={`/dashboard/products/update/${product._id}`} className="flex-1">
                  <button className="w-full bg-yellow-400 text-white py-2 rounded-xl hover:bg-yellow-500 font-medium">
                    ✏️ Edit
                  </button>
                </Link>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 font-medium"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-gray-400 text-xl">No products available!</p>
        </div>
      )}
    </div>
  );
}