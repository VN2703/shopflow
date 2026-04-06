import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-600 mb-3">
          ShopFlow 🛒
        </h1>
        <p className="text-gray-500 text-lg">
          Your one stop shopping destination
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link href="/login">
          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 text-lg font-medium">
            Login
          </button>
        </Link>

        <Link href="/register">
          <button className="bg-white text-blue-500 border border-blue-500 px-8 py-3 rounded-lg hover:bg-blue-50 text-lg font-medium">
            Register
          </button>
        </Link>
      </div>

    </div>
  );
}