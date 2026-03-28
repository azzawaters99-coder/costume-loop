"use client";

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, sans-serif', color: '#333' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#4a0e2e', marginBottom: 8 }}>Terms & Conditions</h1>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 32 }}>Last updated: March 2026</p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>1. About The Costume Loop</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          The Costume Loop (thecostumeloop.co.nz) is an online peer-to-peer marketplace that connects buyers and sellers of second-hand dance costumes across New Zealand and Australia. We provide the platform — we do not own, inspect, or handle any costumes listed for sale.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>2. Platform Role & Limitation of Liability</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          The Costume Loop acts solely as a venue for users to list and discover costumes. We are <strong>not</strong> a party to any transaction between buyers and sellers. We do not guarantee the quality, safety, legality, or accuracy of any listing. All transactions are conducted directly between users at their own risk.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555', marginTop: 10 }}>
          To the fullest extent permitted by law, The Costume Loop, its owners, and its operators shall not be held liable for any loss, damage, claim, or expense arising from the use of this platform, including but not limited to: items not matching their description, items lost or damaged in transit, payment disputes, or any interactions between users.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>3. User Responsibilities</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          Sellers are responsible for providing accurate descriptions, honest photos, and fair pricing for their listings. Buyers are responsible for reviewing listings carefully before purchasing. Both parties are responsible for arranging and completing their own payment and shipping.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>4. Listings & Content</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          By listing an item on The Costume Loop, you confirm that you own the item or have the right to sell it. We reserve the right to remove any listing that violates these terms, is misleading, or is otherwise inappropriate. All listing content (photos, descriptions) remains the property of the user who posted it.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>5. Featured Listings</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          Users may opt to feature their listing for a fee of $5 NZD. Featured listings are displayed with priority placement and visual highlighting for a period of 7 days. The featured listing fee is non-refundable. Featured status does not imply endorsement by The Costume Loop.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>6. Payments & Fees</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          The Costume Loop does not process payments between buyers and sellers. All payment arrangements are made directly between users. Any fees charged by the platform (such as featured listing fees) are separate from the sale price and are non-refundable.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>7. Disputes</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          Any disputes arising between buyers and sellers must be resolved directly between the parties involved. The Costume Loop is not responsible for mediating or resolving disputes. We encourage users to communicate openly and resolve issues in good faith.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>8. Privacy</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          We collect only the information necessary to operate the platform, including your name, email address, and listing details. We do not sell your personal information to third parties. By using The Costume Loop, you consent to the collection and use of your information as described here.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>9. Changes to These Terms</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          We may update these terms from time to time. Continued use of the platform after changes are posted constitutes acceptance of the updated terms. We encourage users to review this page periodically.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#800020', marginBottom: 10 }}>10. Contact</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>
          If you have any questions about these terms, please contact us at <a href="mailto:hello@thecostumeloop.co.nz" style={{ color: '#800020', textDecoration: 'underline' }}>hello@thecostumeloop.co.nz</a>.
        </p>
      </section>

      <div style={{ marginTop: 40, padding: 20, background: '#faf7f2', borderRadius: 12, border: '1px solid #e5e0d5' }}>
        <p style={{ fontSize: 13, color: '#888', lineHeight: 1.7, margin: 0 }}>
          <strong style={{ color: '#4a0e2e' }}>Summary:</strong> The Costume Loop is a marketplace platform only. We connect buyers and sellers but are not responsible for any transactions, items, shipping, or disputes. Use the platform at your own risk and always deal with care.
        </p>
      </div>
    </div>
  );
}
