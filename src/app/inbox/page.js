import Link from 'next/link';

export default function Inbox() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: '#4a0e2e', marginBottom: 6 }}>Messages</h1>
      <p style={{ color: '#888', marginBottom: 32, fontSize: 14 }}>How buyer and seller conversations work on The Costume Loop.</p>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8dcc8', padding: 32 }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>📬</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#4a0e2e', marginBottom: 10 }}>Enquiries come to your email</h2>
        <p style={{ color: '#555', fontSize: 14, lineHeight: 1.75, marginBottom: 14 }}>
          When someone asks about one of your listings, you&apos;ll get an email with their name, contact details and message. Reply directly to continue the conversation — no separate inbox to check.
        </p>
        <p style={{ color: '#555', fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>
          The same goes for buyers: when you send an enquiry, you&apos;ll get a confirmation email and the seller can reach out directly.
        </p>
        <div style={{ background: '#faf7f2', border: '1px solid #e8dcc8', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#666', lineHeight: 1.6 }}>
          <strong style={{ color: '#4a0e2e' }}>Tip:</strong> add <span style={{ fontFamily: 'ui-monospace, monospace' }}>hello@thecostumeloop.co.nz</span> to your contacts so notification emails don&apos;t land in spam.
        </div>
      </div>

      <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/my-listings" style={{ background: '#800020', color: 'white', padding: '12px 24px', borderRadius: 999, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
          Go to My Listings
        </Link>
        <Link href="/browse" style={{ background: 'white', color: '#800020', padding: '12px 24px', borderRadius: 999, fontWeight: 700, textDecoration: 'none', fontSize: 14, border: '2px solid #800020' }}>
          Browse Costumes
        </Link>
      </div>
    </div>
  );
}
