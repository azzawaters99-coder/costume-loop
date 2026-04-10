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
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySent, setEnquirySent] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchListing() {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();
      if (error) { console.error(error); setLoading(false); return; }
      setListing(data);
      if (data?.user_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email, location')
          .eq('id', data.user_id)
          .single();
        setSeller(profile || { full_name: data.seller_name || 'Costume Loop Seller' });
      }
      setLoading(false);
    }
    fetchListing();
  }, [id]);

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

  // Build a mailto link for rental enquiries
  const sellerEmail = seller?.email || '';
  const mailtoSubject = encodeURIComponent(`Rental enquiry: ${listing.title}`);
  const mailtoBody = encodeURIComponent(
    `Hi,\n\nI'm interested in renting your costume: "${listing.title}".\n\nCould you let me know more about availability and how to arrange the rental?\n\nThanks!`
  );
  const mailtoLink = sellerEmail
    ? `mailto:${sellerEmail}?subject=${mailtoSubject}&body=${mailtoBody}`
    : null;

  function handleEnquirySubmit(e) {
    e.preventDefault();
    // In a real implementation, this would send via an API route or Supabase edge function.
    // For now we open a mailto as fallback.
    const body = encodeURIComponent(
      `Hi,\n\nMy name is ${enquiryName}.\n\n${enquiryMessage}\n\nYou can reach me at: ${enquiryEmail}`
    );
    window.location.href = `mailto:${sellerEmail || ''}?subject=${mailtoSubject}&body=${body}`;
    setEnquirySent(true);
    setEnquiryOpen(false);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf7f2' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Back link */}
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
              {images.length > 0 ? (
                <img src={images[activeImage]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span style={{ fontSize: 80 }}>👗</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} className="rounded-lg overflow-hidden flex-shrink-0" style={{ width: 64, height: 64, border: i === activeImage ? '2px solid #800020' : '2px solid transparent', opacity: i === activeImage ? 1 : 0.6 }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:w-1/2">

            {/* Listing type badge */}
            <div style={{ marginBottom: 10 }}>
              <span style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                background: isRental ? '#e8f5e9' : '#fff5f7',
                color: isRental ? '#2e7d32' : '#800020',
                border: `1px solid ${isRental ? '#c8e6c9' : '#f5c2cc'}`,
              }}>
                {isRental ? '🔄 Available to Rent' : '🏷️ For Sale'}
              </span>
            </div>

            <h1 className="text-2xl font-bold mb-2" style={{ color: '#4a0e2e' }}>{listing.title}</h1>

            {/* Price display */}
            {isRental ? (
              <div style={{ marginBottom: 16 }}>
                <p className="text-3xl font-bold" style={{ color: '#2e7d32' }}>
                  ${listing.rental_price_per_week}
                  <span className="text-sm font-normal text-gray-400"> NZD/week</span>
                </p>
                {listing.rental_bond && (
                  <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                    + ${listing.rental_bond} NZD bond (refundable)
                  </p>
                )}
                {listing.rental_min_weeks && listing.rental_min_weeks > 1 && (
                  <p style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
                    Minimum rental: {listing.rental_min_weeks} weeks
                  </p>
                )}
                {listing.rental_availability_notes && (
                  <p style={{ fontSize: 13, color: '#888', marginTop: 4, fontStyle: 'italic' }}>
                    📅 {listing.rental_availability_notes}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-3xl font-bold mb-4" style={{ color: '#800020' }}>
                ${listing.price}
                <span className="text-sm font-normal text-gray-400"> NZD</span>
              </p>
            )}

            {/* Seller info */}
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl" style={{ backgroundColor: '#f2e8d5' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#800020' }}>
                {sellerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#4a0e2e' }}>{sellerName}</p>
                {(seller?.location || listing.location) && (
                  <p className="text-xs text-gray-500">📍 {seller?.location || listing.location}</p>
                )}
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {listing.genre && (
                <div className="p-3 rounded-lg bg-white">
                  <p className="text-xs text-gray-400 mb-1">Genre</p>
                  <p className="text-sm font-semibold" style={{ color: '#4a0e2e' }}>{listing.genre}</p>
                </div>
              )}
              {listing.size && (
                <div className="p-3 rounded-lg bg-white">
                  <p className="text-xs text-gray-400 mb-1">Size</p>
                  <p className="text-sm font-semibold" style={{ color: '#4a0e2e' }}>{listing.size}</p>
                </div>
              )}
              {listing.condition && (
                <div className="p-3 rounded-lg bg-white">
                  <p className="text-xs text-gray-400 mb-1">Condition</p>
                  <p className="text-sm font-semibold" style={{ color: '#4a0e2e' }}>{listing.condition}</p>
                </div>
              )}
              {listing.location && (
                <div className="p-3 rounded-lg bg-white">
                  <p className="text-xs text-gray-400 mb-1">Location</p>
                  <p className="text-sm font-semibold" style={{ color: '#4a0e2e' }}>{listing.location}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {listing.description && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2" style={{ color: '#4a0e2e' }}>Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{listing.description}</p>
              </div>
            )}

            {/* Enquiry sent confirmation */}
            {enquirySent && (
              <div style={{ padding: '12px 16px', borderRadius: 12, background: '#f0f9f4', border: '1px solid #c3e6d4', marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: '#2d6a4f', fontWeight: 600 }}>✅ Enquiry sent! The seller will be in touch.</p>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              {isRental ? (
                <>
                  {/* Primary: Enquire to Rent */}
                  <button
                    onClick={() => setEnquiryOpen(true)}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm"
                    style={{ backgroundColor: '#2e7d32', fontSize: 15 }}
                  >
                    🔄 Enquire to Rent
                  </button>
                  {/* Secondary: Message Seller */}
                  <button
                    className="w-full py-3 rounded-xl font-semibold text-sm border"
                    style={{ borderColor: '#800020', color: '#800020', backgroundColor: 'transparent' }}
                    onClick={() => setEnquiryOpen(true)}
                  >
                    Message Seller
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm"
                    style={{ backgroundColor: '#c49a2a' }}
                  >
                    Message Seller
                  </button>
                  <button
                    className="w-full py-3 rounded-xl font-semibold text-sm border"
                    style={{ borderColor: '#800020', color: '#800020', backgroundColor: 'transparent' }}
                  >
                    Buy Now — ${listing.price} NZD
                  </button>
                </>
              )}
            </div>

            {/* Rental how-it-works note */}
            {isRental && (
              <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: '#f9f9f9', border: '1px solid #eee' }}>
                <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>
                  <strong style={{ color: '#4a0e2e' }}>How renting works:</strong> Send an enquiry and the seller will contact you to confirm availability, arrange pick-up/return, and organise payment directly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {enquiryOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '0 16px' }}
          onClick={e => { if (e.target === e.currentTarget) setEnquiryOpen(false); }}
        >
          <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 460, position: 'relative' }}>
            <button onClick={() => setEnquiryOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#aaa' }}>✕</button>

            <div style={{ fontSize: 36, marginBottom: 8 }}>🔄</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#4a0e2e', marginBottom: 4 }}>Enquire to Rent</h2>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
              <strong style={{ color: '#4a0e2e' }}>{listing.title}</strong> — ${listing.rental_price_per_week} NZD/week
            </p>

            <form onSubmit={handleEnquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#4a0e2e' }}>Your name</label>
                <input
                  required
                  value={enquiryName}
                  onChange={e => setEnquiryName(e.target.value)}
                  placeholder="Jane Smith"
                  style={{ width: '100%', border: '1px solid #e5e5e5', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#4a0e2e' }}>Your email</label>
                <input
                  required
                  type="email"
                  value={enquiryEmail}
                  onChange={e => setEnquiryEmail(e.target.value)}
                  placeholder="jane@example.com"
                  style={{ width: '100%', border: '1px solid #e5e5e5', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#4a0e2e' }}>Message</label>
                <textarea
                  required
                  value={enquiryMessage}
                  onChange={e => setEnquiryMessage(e.target.value)}
                  rows={4}
                  placeholder={`Hi, I'm interested in renting this costume. When is it available?`}
                  style={{ width: '100%', border: '1px solid #e5e5e5', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <button
                type="submit"
                style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: '#2e7d32', color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 4 }}
              >
                Send Enquiry
              </button>
            </form>

            <p style={{ fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 12 }}>
              Your message will be sent directly to the costume owner.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
