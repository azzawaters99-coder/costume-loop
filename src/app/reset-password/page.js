'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase parses the recovery token from the URL fragment and fires
    // PASSWORD_RECOVERY. We also check any existing session so that if the user
    // refreshes this page mid-flow they keep going.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setRecoveryMode(true);
      setReady(true);
    });

    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match — try again.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setDone(true);
      setTimeout(() => router.push('/'), 2500);
    }
    setSaving(false);
  }

  if (!ready) {
    return (
      <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
        Loading…
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: '#faf7f2' }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#4a0e2e', marginBottom: 10 }}>Password updated</h1>
          <p style={{ color: '#666', lineHeight: 1.7 }}>Redirecting you to The Costume Loop…</p>
        </div>
      </div>
    );
  }

  if (!recoveryMode) {
    return (
      <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: '#faf7f2' }}>
        <div style={{ textAlign: 'center', maxWidth: 460 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🔐</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#4a0e2e', marginBottom: 10 }}>Reset link expired</h1>
          <p style={{ color: '#666', lineHeight: 1.7, marginBottom: 28 }}>
            Password reset links are single-use and expire after a short time. Request a fresh one from the sign-in page.
          </p>
          <Link href="/login" style={{ display: 'inline-block', background: '#800020', color: 'white', padding: '13px 28px', borderRadius: 999, fontWeight: 700, textDecoration: 'none' }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: '#faf7f2' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#4a0e2e', marginBottom: 8 }}>Set a new password</h1>
          <p style={{ color: '#888', fontSize: 14 }}>Pick something at least 6 characters long.</p>
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid #e8dcc8' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4a0e2e', marginBottom: 6 }}>New password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  style={{ width: '100%', borderRadius: 10, padding: '11px 44px 11px 14px', fontSize: 14, border: '1px solid #e8dcc8', outline: 'none', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 14 }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4a0e2e', marginBottom: 6 }}>Confirm password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="Retype new password"
                style={{ width: '100%', borderRadius: 10, padding: '11px 14px', fontSize: 14, border: '1px solid #e8dcc8', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            {error && (
              <p style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', fontSize: 14, borderRadius: 8, padding: '10px 12px', margin: 0 }}>{error}</p>
            )}
            <button type="submit" disabled={saving}
              style={{ background: saving ? '#999' : '#800020', color: 'white', fontWeight: 700, padding: 13, borderRadius: 10, border: 'none', fontSize: 15, cursor: saving ? 'default' : 'pointer', marginTop: 4 }}>
              {saving ? 'Saving…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
