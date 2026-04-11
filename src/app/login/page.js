'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';

  const [mode, setMode] = useState(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resetMode, setResetMode] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (resetMode) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login',
      });
      if (error) setError(error.message);
      else setMessage('Check your email for a password reset link!');
      setLoading(false);
      return;
    }

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push(redirectTo);
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        // Save full name to profiles if provided
        if (fullName && data?.user?.id) {
          await supabase.from('profiles').upsert({ id: data.user.id, full_name: fullName });
        }
        setMessage('Check your email to confirm your account!');
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#faf7f2' }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-block px-4 py-2 rounded-lg mb-4" style={{ backgroundColor: '#4a0e2e' }}>
              <span className="text-white text-xs font-semibold tracking-widest block">THE</span>
              <span className="text-white font-bold text-xl leading-tight">
                Costume L<span style={{ color: '#c49a2a' }}>&#x221E;</span>P
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: '#4a0e2e' }}>
            {resetMode ? 'Reset Password' : mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {resetMode ? 'Enter your email to receive a reset link'
              : mode === 'login' ? 'Sign in to your Costume Loop account'
              : 'Join the AU & NZ dance costume community'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">

          {/* Sign In / Sign Up toggle */}
          {!resetMode && (
            <div className="flex rounded-lg overflow-hidden border mb-6" style={{ borderColor: '#e8dcc8' }}>
              <button onClick={() => { setMode('login'); setError(''); setMessage(''); }}
                className="flex-1 py-2 text-sm font-medium transition-colors"
                style={{ backgroundColor: mode === 'login' ? '#800020' : 'white', color: mode === 'login' ? 'white' : '#4a0e2e' }}>
                Sign In
              </button>
              <button onClick={() => { setMode('signup'); setError(''); setMessage(''); }}
                className="flex-1 py-2 text-sm font-medium transition-colors"
                style={{ backgroundColor: mode === 'signup' ? '#800020' : 'white', color: mode === 'signup' ? 'white' : '#4a0e2e' }}>
                Sign Up
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full name — sign up only */}
            {mode === 'signup' && !resetMode && (
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#4a0e2e' }}>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#e8dcc8' }}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#4a0e2e' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: '#e8dcc8' }}
              />
            </div>

            {/* Password with show/hide toggle */}
            {!resetMode && (
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#4a0e2e' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="Min. 6 characters"
                    className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: '#e8dcc8', paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 14 }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            )}

            {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            {message && <p className="text-green-700 text-sm bg-green-50 rounded-lg px-3 py-2">{message}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-sm mt-2"
              style={{ backgroundColor: '#800020', color: 'white', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Please wait...'
                : resetMode ? 'Send Reset Link'
                : mode === 'login' ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          {/* Trust signal for sign up */}
          {mode === 'signup' && !resetMode && (
            <p className="text-center text-xs text-gray-400 mt-4">
              Join 500+ dance families buying and selling across AU & NZ
            </p>
          )}

          {mode === 'login' && !resetMode && (
            <p className="text-center text-sm mt-4">
              <button onClick={() => setResetMode(true)}
                className="hover:underline" style={{ color: '#800020', background: 'none', border: 'none', cursor: 'pointer' }}>
                Forgot your password?
              </button>
            </p>
          )}

          {resetMode && (
            <p className="text-center text-sm mt-4">
              <button onClick={() => setResetMode(false)}
                className="hover:underline" style={{ color: '#800020', background: 'none', border: 'none', cursor: 'pointer' }}>
                &#x2190; Back to Sign In
              </button>
            </p>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="hover:underline" style={{ color: '#800020' }}>&#x2190; Back to home</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf7f2' }}><p className="text-gray-400">Loading...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
