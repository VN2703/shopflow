'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/view`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) setCart(data.cart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = async (productId: string) => {
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    fetchCart();
  };

  const decreaseQty = async (productId: string, currentQty: number) => {
    if (currentQty <= 1) {
      removeItem(productId);
      return;
    }
    const token = localStorage.getItem('token');
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cart/reduce/${productId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: 1 }),
      }
    );
    fetchCart();
  };

  const removeItem = async (productId: string) => {
    const token = localStorage.getItem('token');
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cart/remove/${productId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setMessage('Item removed!');
    fetchCart();
    setTimeout(() => setMessage(''), 2000);
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/clear`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessage('Cart cleared!');
    fetchCart();
    setTimeout(() => setMessage(''), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-lg">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🛒 My Cart</h1>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        {!cart || cart.items?.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <p className="text-6xl mb-4">🛒</p>
            <p className="text-xl text-gray-500 mb-6">Your cart is empty!</p>
            <Link href="/products">
              <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 text-lg">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">

            {/* Cart Items */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              {cart.items.map((item: any, index: number) => (
                <div
                  key={item._id}
                  className={`p-5 flex items-center gap-4 ${
                    index !== cart.items.length - 1 ? 'border-b' : ''
                  }`}
                >
                  {/* Product Icon */}
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    📦
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">
                      {item.product?.name || 'Product'}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      ₹{item.price} per item
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item.product?._id, item.quantity)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 font-bold text-lg"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold text-lg">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQty(item.product?._id)}
                      className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 font-bold text-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right w-24">
                    <p className="font-bold text-blue-600 text-lg">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.product?._id)}
                    className="text-red-400 hover:text-red-600 text-xl ml-2"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Items ({cart.items.length})</span>
                <span>₹{cart.totalPrice}</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-xl mt-3">
                <span>Total</span>
                <span className="text-blue-600">₹{cart.totalPrice}</span>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={clearCart}
                  className="flex-1 border border-red-400 text-red-400 py-3 rounded-lg hover:bg-red-50 font-medium"
                >
                  Clear Cart
                </button>
                <Link href="/orders/place" className="flex-2 w-full">
                  <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-bold text-lg">
                    Place Order →
                  </button>
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}