import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'white', borderTop: '1px solid #eee', marginTop: 64, padding: '48px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48 }}>
        <div>
          <div style={{ background: '#4a0e2e', color: 'white', padding: '6px 12px', borderRadius: 6, display: 'inline-block', marginBottom: 16, lineHeight: 1.3 }}>
            <div style={{ fontSize: 7, letterSpacing: 3, opacity: 0.6, textTransform: 'uppercase' }}>THE</div>
            <div style={{ fontSize: 14, fontWeight: 800 }}>Costume L<span style={{ color: '#e8a838' }}>\u221E</span>P</div>
          </div>
          <p style={{ fontSize: 13, color: '#999', lineHeight: 1.7, maxWidth: 260 }}>Australia and New Zealand marketplace for pre-loved dance costumes.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <a href="https://www.instagram.com/thecostumeloop" target="_blank" rel="noopener noreferrer" style={{ color: '#999', textDecoration: 'none' }} aria-label="Instagram">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://www.facebook.com/thecostumeloop" target="_blank" rel="noopener noreferrer" style={{ color: '#999', textDecoration: 'none' }} aria-label="Facebook">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z"/></svg>
            </a>
          </div>
          <p style={{ fontSize: 12, color: '#bbb', marginTop: 16 }}>&copy; {new Date().getFullYear()} The Costume Loop. All rights reserved.</p>
        </div>

        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Quick Links</h4>
          {[['Browse', '/browse'], ['List a Costume', '/list'], ['For Studios', '/for-studios'], ['FAQ', '/faq'], ['About', '/about']].map(([l, h]) => (
            <div key={l} style={{ marginBottom: 10 }}><Link href={h} style={{ fontSize: 13, color: '#999', textDecoration: 'none' }}>{l}</Link></div>
          ))}
        </div>

        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Legal</h4>
          <div style={{ marginBottom: 10 }}><Link href="/privacy" style={{ fontSize: 13, color: '#999', textDecoration: 'none' }}>Privacy Policy</Link></div>
          <div style={{ marginBottom: 10 }}><Link href="/terms" style={{ fontSize: 13, color: '#999', textDecoration: 'none' }}>Terms of Service</Link></div>
        </div>

        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Get in Touch</h4>
          <a href="mailto:hello@thecostumeloop.com" style={{ fontSize: 13, color: '#999', textDecoration: 'none', display: 'block', marginBottom: 8 }}>hello@thecostumeloop.com</a>
          <p style={{ fontSize: 13, color: '#999' }}>Built by dance parents, for dance families.</p>
        </div>
      </div>
    </footer>
  );
}
