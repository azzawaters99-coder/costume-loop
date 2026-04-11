'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Suspense } from 'react';

const TRUST_SIGNALS = [
  { icon: '👗', text: '500+ costumes listed across AU & NZ' },
  { icon: '🔒', text: 'Safe & secure — no payment until you agree' },
  { icon: '💬', text: 'Direct contact with sellers & buyers' },
  { icon: '♻️', text: 'Give costumes a second life' },
];

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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [signUpDone, setSignUpDone] = useState(false);

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + (redirectTo !== '/' ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/'),
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
    // OAuth redirects the page — no further action needed
  }

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
      else setMessage('Done! Check your email for a reset link.');
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
        if (fullName && data?.user?.id) {
          await supabase.from('profiles').upsert({ id: data.user.id, full_name: fullName });
        }
        setSignUpDone(true);
      }
    }
    setLoading(false);
  }

  // Post sign-up confirmation screen
  if (signUpDone) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#faf7f2' }}>
        <div className="w-full max-w-md text-center">
          <div style={{ fontSize: 72, marginBottom: 16 }}>📬</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#4a0e2e', marginBottom: 12 }}>Check your email!</h1>
          <p style={{ color: '#666', lineHeight: 1.7, marginBottom: 8 }}>
            We sent a confirmation link to <strong style={{ color: '#4a0e2e' }}>{email}</strong>.
          </p>
          <p style={{ color: '#888', fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
            Click the link in the email to activate your account, then come back here to sign in.
          </p>
          <div style={{ background: 'white', borderRadius: 16, padding: 20, marginBottom: 24, border: '1px solid #e8dcc8' }}>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>While you wait, you can:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/browse" style={{ display: 'block', padding: '12px 20px', background: '#800020', color: 'white', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                Browse Costumes
              </Link>
              <Link href="/" style={{ display: 'block', padding: '12px 20px', background: '#f2e8d5', color: '#4a0e2e', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                Back to Homepage
              </Link>
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#bbb' }}>
            Didn't get the email?{' '}
            <button onClick={() => { setSignUpDone(false); setMode('signup'); }}
              style={{ color: '#800020', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>
              Try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#faf7f2' }}>
      <div style={{ display: 'flex', gap: 40, width: '100%', maxWidth: 860, alignItems: 'flex-start' }}>

        {/* Left: Trust signals — shown on sign up, hidden on login */}
        {mode === 'signup' && !resetMode && (
          <div className="hidden md:block" style={{ flex: 1, paddingTop: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#4a0e2e', marginBottom: 8 }}>
              The home of second-hand dance costumes in AU & NZ
            </h2>
            <p style={{ color: '#888', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
              Join thousands of dance families saving money and giving beautiful costumes a second life.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {TRUST_SIGNALS.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f2e8d5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <p style={{ fontSize: 14, color: '#555', lineHeight: 1.5 }}>{s.text}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32, padding: '16px 20px', background: 'white', borderRadius: 12, border: '1px solid #e8dcc8' }}>
              <p style={{ fontSize: 13, color: '#888', fontStyle: 'italic', lineHeight: 1.6 }}>
                "Found the perfect ballet tutu for half the price of new. Couldn't be happier!"
              </p>
              <p style={{ fontSize: 12, color: '#c49a2a', fontWeight: 700, marginTop: 8 }}>— Sarah M., Auckland</p>
            </div>
          </div>
        )}

        {/* Right: Form */}
        <div style={{ flex: mode === 'signup' ? '0 0 400px' : '0 0 420px', maxWidth: '100%' }}>
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
              {resetMode ? 'Reset Password' : mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {resetMode ? 'Enter your email to receive a reset link'
                : mode === 'login' ? 'Sign in to your Costume Loop account'
                : 'Free to join — takes less than a minute'}
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

            {/* Google sign-in button */}
            {!resetMode && (
              <>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  style={{
                    width: '100%', padding: '11px 16px', borderRadius: 10,
                    border: '1px solid #e0e0e0', background: 'white', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 16,
                    opacity: googleLoading ? 0.7 : 1, transition: 'box-shadow 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  {/* Google SVG icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {googleLoading ? 'Redirecting...' : `Continue with Google`}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ flex: 1, height: 1, background: '#e8dcc8' }} />
                  <span style={{ fontSize: 12, color: '#bbb', flexShrink: 0 }}>or with email</span>
                  <div style={{ flex: 1, height: 1, background: '#e8dcc8' }} />
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full name — sign up only */}
              {mode === 'signup' && !resetMode && (
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#4a0e2e' }}>Full Name</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: '#e8dcc8' }} />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#4a0e2e' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  required placeholder="you@example.com"
                  className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#e8dcc8' }} />
              </div>

              {/* Password with show/hide */}
              {!resetMode && (
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#4a0e2e' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPassword ? 'text' : 'password'} value={password}
                      onChange={e => setPassword(e.target.value)} required
                      placeholder="Min. 6 characters"
                      className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                      style={{ borderColor: '#e8dcc8', paddingRight: 44 }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 14 }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              )}

              {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
              {message && <p className="text-green-700 text-sm bg-green-50 rounded-lg px-3 py-2">{message}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-lg font-bold text-sm"
                style={{ backgroundColor: '#800020', color: 'white', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
                {loading ? 'Please wait...'
                  : resetMode ? 'Send Reset Link'
                  : mode === 'login' ? 'Sign In'
                  : 'Create Free Account'}
              </button>
            </form>

            {/* Terms note on sign up */}
            {mode === 'signup' && !resetMode && (
              <p style={{ fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
                By creating an account you agree to our{' '}
                <Link href="/terms" style={{ color: '#800020' }}>Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" style={{ color: '#800020' }}>Privacy Policy</Link>
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
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf7f2' }}>
        <p className="text-gray-400">Loading...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
