'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push('/');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage('Check your email to confirm your account!');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#faf7f2' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-block px-4 py-2 rounded-lg mb-4" style={{ backgroundColor: '#4a0e2e' }}>
              <span className="text-white text-xs font-semibold tracking-widest block">THE</span>
              <span className="text-white font-bold text-xl leading-tight">Costume L∞P</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: '#4a0e2e' }}>
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'login' ? 'Sign in to your Costume Loop account' : 'Join the dance costume community'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex rounded-lg overflow-hidden border mb-6" style={{ borderColor: '#e8dcc8' }}>
            <button onClick={() => setMode('login')} className="flex-1 py-2 text-sm font-medium transition-colors"
              style={{ backgroundColor: mode === 'login' ? '#800020' : 'white', color: mode === 'login' ? 'white' : '#4a0e2e' }}>
              Sign In
            </button>
            <button onClick={() => setMode('signup')} className="flex-1 py-2 text-sm font-medium transition-colors"
              style={{ backgroundColor: mode === 'signup' ? '#800020' : 'white', color: mode === 'signup' ? 'white' : '#4a0e2e' }}>
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#4a0e2e' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com"
                className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: '#e8dcc8' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#4a0e2e' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: '#e8dcc8' }} />
            </div>

            {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            {message && <p className="text-green-700 text-sm bg-green-50 rounded-lg px-3 py-2">{message}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-sm mt-2"
              style={{ backgroundColor: '#800020', color: 'white' }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="hover:underline" style={{ color: '#800020' }}>← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
