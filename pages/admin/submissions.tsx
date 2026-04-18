import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SubmissionsTable from '../../components/SubmissionsTable';

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated (in session)
    const authToken = sessionStorage.getItem('admin_auth_token');
    if (authToken) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple password check (in production, use proper authentication)
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

    if (password === correctPassword) {
      sessionStorage.setItem('admin_auth_token', 'authenticated');
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth_token');
    setIsAuthenticated(false);
    setPassword('');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin Login - Dupree Ops</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Admin Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 font-medium"
              >
                Login
              </button>
            </form>

            <p className="text-xs text-gray-600 text-center mt-4">
              This page is protected and should only be accessible by administrators.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Submissions - Admin Panel - Dupree Ops</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white border-b border-gray-300">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Contact Form Submissions
            </h2>
            <p className="text-gray-600">
              View and manage all contact form submissions from the website.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <SubmissionsTable />
          </div>

          <div className="mt-6 text-sm text-gray-600 bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold mb-2">Admin Notes:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Click column headers to sort submissions</li>
              <li>Submissions are stored securely in Supabase</li>
              <li>Deleted submissions cannot be recovered</li>
              <li>Session expires when you close the browser</li>
              <li>This page is not indexed by search engines</li>
            </ul>
          </div>
        </main>
      </div>
    </>
  );
}
