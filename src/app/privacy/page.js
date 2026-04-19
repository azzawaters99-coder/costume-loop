"use client";

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, sans-serif', color: '#333' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#4a0e2e', marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 32 }}>Last updated: April 2026</p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>1. Who we are</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          The Costume Loop (thecostumeloop.co.nz) is a peer-to-peer marketplace that connects buyers and sellers of second-hand dance costumes across New Zealand and Australia. This policy explains what information we collect, how we use it, and the choices you have.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>2. What we collect</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          When you create an account or list a costume we collect your email address, display name, optional profile details, the listings you create (photos, descriptions, prices, location) and the messages or enquiries you send through the platform. We also collect basic usage information such as pages visited and device type so we can improve the site.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>3. How we use your information</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          We use your information to run the marketplace: showing your listings, letting buyers contact sellers, keeping accounts secure, answering your questions, and sending occasional service emails such as account confirmations or replies to enquiries. We do not sell your personal information to third parties.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>4. Who can see what</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          Your display name, listings and messages are visible to the other party in a conversation. Your email address is only shared with someone when you choose to share it in a message. Listings are public on the site unless removed by you.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>5. Payments</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          The Costume Loop does not process payments between buyers and sellers. Any payment arrangements are made directly between users, and we do not hold your card or bank details. Any platform fees (such as featured listings) are handled by a trusted third-party payment provider; we do not store card numbers on our servers.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>6. How we store it</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          We use Supabase for authentication and data storage, with industry-standard encryption in transit and at rest. We keep your information only as long as your account is active or as needed to provide the service and meet legal obligations.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>7. Your choices</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          You can update your profile, edit or remove your listings, and request deletion of your account at any time by emailing <a href="mailto:hello@thecostumeloop.co.nz" style={{ color: '#800020', textDecoration: 'underline' }}>hello@thecostumeloop.co.nz</a>. Under the Australian Privacy Principles and the New Zealand Privacy Act 2020 you can also request a copy of the personal information we hold about you.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>8. Cookies</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          We use essential cookies to keep you signed in and a small number of analytics cookies to understand how people use the site so we can improve it. We do not use third-party advertising cookies.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>9. Children</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          The Costume Loop is intended for people aged 18 and over, or younger users with the supervision of a parent or guardian. We do not knowingly collect information directly from children under 13.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>10. Changes & contact</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          We may update this policy from time to time. If the change is significant we will let you know by email or a notice on the site. Questions or requests? Email <a href="mailto:hello@thecostumeloop.co.nz" style={{ color: '#800020', textDecoration: 'underline' }}>hello@thecostumeloop.co.nz</a>.
        </p>
      </section>

      <div style={{ marginTop: 40, padding: 20, background: '#faf7f2', borderRadius: 12, border: '1px solid #e5e0d5' }}>
        <p style={{ fontSize: 13, color: '#888', lineHeight: 1.7, margin: 0 }}>
          <strong style={{ color: '#4a0e2e' }}>Summary:</strong> we collect the minimum information needed to run the marketplace, we never sell your data, payments between users don&apos;t flow through us, and you can ask for a copy or deletion of your data any time.
        </p>
      </div>
    </div>
  );
}
