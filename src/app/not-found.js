import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#faf7f2', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🩰</div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#4a0e2e', marginBottom: 12 }}>404</h1>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#800020', marginBottom: 16 }}>This page has left the stage</h2>
        <p style={{ color: '#888', lineHeight: 1.7, marginBottom: 32 }}>
          The page you are looking for does not exist or has been moved. Let us help you find what you need.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ display: 'inline-block', background: '#800020', color: 'white', fontWeight: 700, padding: '13px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 15 }}>
            Go Home
          </Link>
          <Link href="/browse" style={{ display: 'inline-block', background: '#e8a838', color: '#4a0e2e', fontWeight: 700, padding: '13px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 15 }}>
            Browse Costumes
          </Link>
        </div>
      </div>
    </div>
  );
}
