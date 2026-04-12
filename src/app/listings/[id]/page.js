'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('message'); // 'buy' | 'rent' | 'message'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    if (!id) return;
    async function fetchListing() {
      setLoading(true);
      const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
      if (error) { console.error(error); setLoading(false); return; }
      setListing(data);
      if (data?.user_id) {
        const { data: profile } = await supabase.from('profiles')
          .select('full_name, email, location').eq('id', data.user_id).single();
        setSeller(profile || { full_name: data.seller_name || 'Costume Loop Seller' });
      }
      setLoading(false);
    }
    fetchListing();
  }, [id]);

  // Pre-fill message based on enquiry type
  function openModal(type) {
    setModalType(type);
    setSent(false);
    setSendError('');
    if (type === 'buy') {
      setMessage(`Hi, I'm interested in buying "${listing?.title}" for $${listing?.price} NZD. Is it still available? How would you like to arrange payment and pickup/shipping?`);
    } else if (type === 'rent') {
      setMessage(`Hi, I'm interested in renting "${listing?.title}". Could you let me know about availability, how to arrange pickup/return, and payment?`);
    } else {
      setMessage('');
    }
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setSendError('');
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId:    listing.id,
          listingTitle: listing.title,
          listingType:  listing.listing_type || 'sale',
          listingPrice: isRental ? listing.rental_price_per_week : listing.price,
          listingUrl:   window.location.href,
          sellerEmail:  seller?.email || '',
          sellerName:   seller?.full_name || 'Seller',
          buyerName:    name,
          buyerEmail:   email,
          buyerPhone:   phone,
          message,
          enquiryType:  modalType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setSent(true);
    } catch (err) {
      setSendError('Something went wrong. Please try again.');
    }
    setSending(false);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf7f2' }}>
      <p className="text-gray-400">Loading listing...</p>
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#faf7f2' }}>
      <p style={{ fontSize: 48 }}>😕</p>
      <h1 className="text-xl font-bold" style={{ color: '#4a0e2e' }}>Listing not found</h1>
      <Link href="/browse" className="text-sm underline" style={{ color: '#800020' }}>Back to Browse</Link>
    </div>
  );

  const images = listing.images || [];
  const sellerName = seller?.full_name || listing.seller_name || 'Costume Loop Seller';
  const isRental = listing.listing_type === 'rental';
  const measurements = [
    { key: 'measure_chest',  label: 'Chest' },
    { key: 'measure_waist',  label: 'Waist' },
    { key: 'measure_hips',   label: 'Hips' },
    { key: 'measure_height', label: 'Height' },
    { key: 'measure_inseam', label: 'Inseam' },
  ].filter(m => listing[m.key]);

  const modalConfig = {
    buy:     { icon: '🛍️', title: 'Make an Offer',    color: '#800020', btn: 'Send Offer' },
    rent:    { icon: '🔄', title: 'Enquire to Rent',  color: '#2e7d32', btn: 'Send Enquiry' },
    message: { icon: '💬', title: 'Message Seller',   color: '#4a0e2e', btn: 'Send Message' },
  };
  const mc = modalConfig[modalType];

  const inp = { width: '100%', border: '1px solid #e5e5e5', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf7f2' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">

        <Link href="/browse" className="inline-flex items-center gap-1 text-sm mb-6" style={{ color: '#800020', textDecoration: 'none' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Browse
        </Link>

        <div className="flex flex-col md:flex-row gap-8">

          {/* Image gallery */}
          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#f2e8d5', aspectRatio: '1' }}>
              {images.length > 0
                ? <img src={images[activeImage]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div className="w-full h-full flex items-center justify-center"><span style={{ fontSize: 80 }}>👗</span></div>
              }
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} className="rounded-lg overflow-hidden flex-shrink-0"
                    style={{ width: 64, height: 64, border: i === activeImage ? '2px solid #800020' : '2px solid transparent', opacity: i === activeImage ? 1 : 0.6 }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:w-1/2">

            {/* Badge */}
            <div style={{ marginBottom: 10 }}>
              <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: isRental ? '#e8f5e9' : '#fff5f7', color: isRental ? '#2e7d32' : '#800020', border: `1px solid ${isRental ? '#c8e6c9' : '#f5c2cc'}` }}>
                {isRental ? '🔄 Available to Rent' : '🏷️ For Sale'}
              </span>
            </div>

            <h1 className="text-2xl font-bold mb-2" style={{ color: '#4a0e2e' }}>{listing.title}</h1>

            {/* Price */}
            {isRental ? (
              <div style={{ marginBottom: 16 }}>
                <p className="text-3xl font-bold" style={{ color: '#2e7d32' }}>
                  ${listing.rental_price_per_week}<span className="text-sm font-normal text-gray-400"> NZD/week</span>
                </p>
                {listing.rental_bond && <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>+ ${listing.rental_bond} NZD bond (refundable)</p>}
                {listing.rental_min_weeks > 1 && <p style={{ fontSize: 13, color: '#666', marginTop: 2 }}>Minimum rental: {listing.rental_min_weeks} weeks</p>}
                {listing.rental_availability_notes && <p style={{ fontSize: 13, color: '#888', marginTop: 4, fontStyle: 'italic' }}>📅 {listing.rental_availability_notes}</p>}
              </div>
            ) : (
              <p className="text-3xl font-bold mb-4" style={{ color: '#800020' }}>
                ${listing.price}<span className="text-sm font-normal text-gray-400"> NZD</span>
              </p>
            )}

            {/* Seller */}
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl" style={{ backgroundColor: '#f2e8d5' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#800020' }}>
                {sellerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#4a0e2e' }}>{sellerName}</p>
                {(seller?.location || listing.location) && <p className="text-xs text-gray-500">📍 {seller?.location || listing.location}</p>}
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {listing.genre && <div className="p-3 rounded-lg bg-white"><p className="text-xs text-gray-400 mb-1">Genre</p><p className="text-sm font-semibold" style={{ color: '#4a0e2e' }}>{listing.genre}</p></div>}
              {listing.size && <div className="p-3 rounded-lg bg-white"><p className="text-xs text-gray-400 mb-1">Size</p><p className="text-sm font-semibold" style={{ color: '#4a0e2e' }}>{listing.size}</p></div>}
              {listing.condition && <div className="p-3 rounded-lg bg-white"><p className="text-xs text-gray-400 mb-1">Condition</p><p className="text-sm font-semibold" style={{ color: '#4a0e2e' }}>{listing.condition}</p></div>}
              {listing.location && <div className="p-3 rounded-lg bg-white"><p className="text-xs text-gray-400 mb-1">Location</p><p className="text-sm font-semibold" style={{ color: '#4a0e2e' }}>{listing.location}</p></div>}
            </div>

            {/* Measurements */}
            {measurements.length > 0 && (
              <div style={{ background: '#faf7f2', border: '1px solid #e8dcc8', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <span style={{ fontSize: 16 }}>📏</span>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#4a0e2e' }}>Measurements <span style={{ fontWeight: 400, color: '#bbb', fontSize: 11 }}>(cm)</span></p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {measurements.map(m => (
                    <div key={m.key} style={{ background: 'white', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                      <p style={{ fontSize: 11, color: '#aaa', marginBottom: 2 }}>{m.label}</p>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#4a0e2e' }}>{listing[m.key]}<span style={{ fontSize: 11, fontWeight: 400, color: '#bbb' }}>cm</span></p>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: '#bbb', marginTop: 10, lineHeight: 1.5 }}>Tip: measure the dancer and add 2-3cm ease for comfort.</p>
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2" style={{ color: '#4a0e2e' }}>Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{listing.description}</p>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              {isRental ? (
                <>
                  <button onClick={() => openModal('rent')}
                    className="w-full py-3 rounded-xl text-white font-semibold"
                    style={{ backgroundColor: '#2e7d32', fontSize: 15 }}>
                    🔄 Enquire to Rent
                  </button>
                  <button onClick={() => openModal('message')}
                    className="w-full py-3 rounded-xl font-semibold border"
                    style={{ borderColor: '#800020', color: '#800020', background: 'transparent', fontSize: 14 }}>
                    💬 Message Seller
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => openModal('buy')}
                    className="w-full py-3 rounded-xl text-white font-semibold"
                    style={{ backgroundColor: '#800020', fontSize: 15 }}>
                    🛍️ Make an Offer — ${listing.price} NZD
                  </button>
                  <button onClick={() => openModal('message')}
                    className="w-full py-3 rounded-xl font-semibold border"
                    style={{ borderColor: '#800020', color: '#800020', background: 'transparent', fontSize: 14 }}>
                    💬 Message Seller
                  </button>
                </>
              )}
            </div>

            {/* How it works note */}
            <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: '#f9f9f9', border: '1px solid #eee' }}>
              <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>
                <strong style={{ color: '#4a0e2e' }}>How it works:</strong> Send your message and both you and the seller will receive an email. You can then arrange payment and {isRental ? 'pickup/return' : 'shipping or pickup'} directly.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* === ENQUIRY MODAL === */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '0 16px' }}
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>

            <button onClick={() => setModalOpen(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#aaa' }}>✕</button>

            {sent ? (
              /* Success state */
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>📬</div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#4a0e2e', marginBottom: 8 }}>Message sent!</h2>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, marginBottom: 8 }}>
                  We've notified <strong>{sellerName}</strong> and sent you a confirmation to <strong>{email}</strong>.
                </p>
                <p style={{ fontSize: 13, color: '#aaa', marginBottom: 24 }}>
                  The seller will be in touch directly to arrange the details.
                </p>
                <button onClick={() => setModalOpen(false)}
                  style={{ padding: '12px 32px', borderRadius: 10, border: 'none', background: mc.color, color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                  Back to listing
                </button>
              </div>
            ) : (
              /* Form state */
              <>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{mc.icon}</div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#4a0e2e', marginBottom: 4 }}>{mc.title}</h2>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
                  <strong style={{ color: '#4a0e2e' }}>{listing.title}</strong>
                  {' · '}
                  {isRental ? `$${listing.rental_price_per_week} NZD/week` : `$${listing.price} NZD`}
                </p>

                {sendError && (
                  <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fff0f0', border: '1px solid #fcc', marginBottom: 16, fontSize: 13, color: '#c00' }}>
                    {sendError}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#4a0e2e' }}>Your name *</label>
                    <input required value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#4a0e2e' }}>Your email *</label>
                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#4a0e2e' }}>
                      Phone <span style={{ fontWeight: 400, color: '#aaa' }}>(optional)</span>
                    </label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+64 21 123 4567" style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#4a0e2e' }}>Message *</label>
                    <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={4}
                      style={{ ...inp, resize: 'vertical' }} />
                  </div>

                  <button type="submit" disabled={sending}
                    style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: mc.color, color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: sending ? 0.7 : 1, marginTop: 4 }}>
                    {sending ? 'Sending...' : mc.btn}
                  </button>
                </form>

                <p style={{ fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
                  Both you and the seller will receive an email confirmation from hello@thecostumeloop.co.nz
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
