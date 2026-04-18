'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function SubmissionsTable() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'email'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadSubmissions();
  }, [sortBy, sortOrder]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase credentials');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      let query = supabase.from('contact_submissions').select('*');

      // Apply sorting
      const isAscending = sortOrder === 'asc';
      query = query.order(sortBy, { ascending: isAscending });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setSubmissions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase credentials');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error: deleteError } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setSubmissions(submissions.filter((sub) => sub.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete submission');
    }
  };

  const toggleSort = (column: 'date' | 'name' | 'email') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const SortIcon = ({ column }: { column: 'date' | 'name' | 'email' }) => {
    if (sortBy !== column) {
      return <span className="ml-1 text-gray-400">↕</span>;
    }
    return <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => toggleSort('name')}
              >
                Name <SortIcon column="name" />
              </th>
              <th
                className="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => toggleSort('email')}
              >
                Email <SortIcon column="email" />
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Message
              </th>
              <th
                className="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => toggleSort('date')}
              >
                Date <SortIcon column="date" />
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  No submissions yet
                </td>
              </tr>
            ) : (
              submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {submission.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <a
                      href={`mailto:${submission.email}`}
                      className="text-emerald-600 hover:underline"
                    >
                      {submission.email}
                    </a>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 max-w-xs truncate">
                    {submission.message}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {formatDate(submission.created_at)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDelete(submission.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-600">
        Total submissions: {submissions.length}
      </div>
    </div>
  );
}
