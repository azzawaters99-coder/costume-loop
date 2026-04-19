'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Surface in Vercel logs / client monitoring
    console.error('App error boundary caught:', error);
  }, [error]);

  return (
    <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: '#faf7f2' }}>
      <div style={{ textAlign: 'center', maxWidth: 520 }}>
        <div style={{ fontSize: 72, marginBottom: 12 }}>🎭</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#4a0e2e', marginBottom: 12 }}>
          Something went wrong
        </h1>
        <p style={{ color: '#666', lineHeight: 1.7, marginBottom: 24, fontSize: 15 }}>
          We hit an unexpected error loading this page. It&apos;s been logged on our end — please try again in a moment.
        </p>
        {error?.digest && (
          <p style={{ color: '#aaa', fontSize: 12, marginBottom: 24, fontFamily: 'ui-monospace, monospace' }}>
            Reference: {error.digest}
          </p>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => reset()}
            style={{ background: '#800020', color: 'white', padding: '13px 28px', borderRadius: 999, fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 15 }}
          >
            Try Again
          </button>
          <Link href="/" style={{ background: 'white', color: '#800020', padding: '13px 28px', borderRadius: 999, fontWeight: 700, textDecoration: 'none', fontSize: 15, border: '2px solid #800020' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
