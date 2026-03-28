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

  useEffect(() => {
    if (!id) return;
    async function fetchListing() {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setListing(data);

      // Fetch seller profile info
      if (data?.user_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email, location')
          .eq('id', data.user_id)
          .single();

        if (profile) {
          setSeller(profile);
        } else {
          // Fallback: use email from listing or user_id
          setSeller({ full_name: data.seller_name || 'Costume Loop Seller' });
        }
      }

      setLoading(false);
    }

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf7f2' }}>
        <p className="text-gray-400">Loading listing...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#faf7f2' }}>
        <p style={{ fontSize: 48 }}>😕</p>
        <h1 className="text-xl font-bold" style={{ color: '#4a0e2e' }}>Listing not found</h1>
        <Link href="/browse" className="text-sm underline" style={{ color: '#800020' }}>Back to Browse</Link>
      </div>
    );
  }

  const images = listing.images || [];
  const sellerName = seller?.full_name || listing.seller_name || 'Costume Loop Seller';

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
                <img
                  src={images[activeImage]}
                  alt={listing.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span style={{ fontSize: 80 }}>👗</span>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="rounded-lg overflow-hidden flex-shrink-0"
                    style={{
                      width: 64,
                      height: 64,
                      border: i === activeImage ? '2px solid #800020' : '2px solid transparent',
                      opacity: i === activeImage ? 1 : 0.6,
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:w-1/2">
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#4a0e2e' }}>{listing.title}</h1>

            <p className="text-3xl font-bold mb-4" style={{ color: '#800020' }}>
              ${listing.price} <span className="text-sm font-normal text-gray-400">NZD</span>
            </p>

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

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
