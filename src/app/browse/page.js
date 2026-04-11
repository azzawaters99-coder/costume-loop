'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const GENRES = ['All','Ballet','Contemporary','Jazz & Tap','Cultural & Character','Acrobatics','Hip Hop','Musical Theatre','Duos & Trios','Group Costumes'];
const SIZES = ['All','Age 2-4','Age 4-6','Age 6-8','Age 8-10','Age 10-12','Age 12-14','Adult XS','Adult S','Adult M','Adult L','Adult XL'];

export default function BrowsePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listingTab, setListingTab] = useState('all');
  const [genre, setGenre] = useState('All');
  const [size, setSize] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      let query = supabase
        .from('listings')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (listingTab === 'sale') {
        query = query.or('listing_type.eq.sale,listing_type.is.null');
      } else if (listingTab === 'rental') {
        query = query.eq('listing_type', 'rental');
      }
      if (genre !== 'All') query = query.eq('genre', genre);
      if (size !== 'All') query = query.eq('size', size);

      const { data, error } = await query;
      if (error) { console.error(error); setLoading(false); return; }
      setListings(data || []);
      setLoading(false);
    }
    fetchListings();
  }, [listingTab, genre, size]);

  const filtered = listings.filter(l =>
    !search || l.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#faf7f2' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#4a0e2e', marginBottom: 4 }}>Browse Costumes</h1>
          <p style={{ color: '#888', fontSize: 14 }}>Find pre-loved dance costumes across AU & NZ</p>
        </div>

        {/* Sale / Rental tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: '#f2e8d5', borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {[{ val: 'all', label: '✨ All' }, { val: 'sale', label: '🏷️ For Sale' }, { val: 'rental', label: '🔄 For Rent' }].map(tab => (
            <button key={tab.val} onClick={() => setListingTab(tab.val)}
              style={{ padding: '8px 20px', borderRadius: 9, border: 'none', background: listingTab === tab.val ? 'white' : 'transparent', color: listingTab === tab.val ? '#4a0e2e' : '#888', fontWeight: listingTab === tab.val ? 700 : 500, fontSize: 14, cursor: 'pointer', boxShadow: listingTab === tab.val ? '0 1px 4px rgba(0,0,0,0.10)' : 'none', transition: 'all 0.15s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters — with labels */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#aaa' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search costumes..."
              style={{ width: '100%', paddingLeft: 36, paddingRight: 16, paddingTop: 10, paddingBottom: 10, borderRadius: 10, border: '1px solid #e5e5e5', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'white' }} />
          </div>

          {/* Genre with label */}
          <div style={{ flex: '0 1 190px' }}>
            <select value={genre} onChange={e => setGenre(e.target.value)} aria-label="Filter by genre"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e5e5', fontSize: 14, background: 'white', outline: 'none', cursor: 'pointer', color: genre === 'All' ? '#aaa' : '#4a0e2e' }}>
              <option value="All">Genre: All</option>
              {GENRES.filter(g => g !== 'All').map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Size with label */}
          <div style={{ flex: '0 1 170px' }}>
            <select value={size} onChange={e => setSize(e.target.value)} aria-label="Filter by size"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e5e5', fontSize: 14, background: 'white', outline: 'none', cursor: 'pointer', color: size === 'All' ? '#aaa' : '#4a0e2e' }}>
              <option value="All">Size: All</option>
              {SIZES.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Clear filters — only shown when active */}
          {(genre !== 'All' || size !== 'All' || search) && (
            <button onClick={() => { setGenre('All'); setSize('All'); setSearch(''); }}
              style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #e5e5e5', background: 'white', fontSize: 13, color: '#800020', cursor: 'pointer', fontWeight: 600 }}>
              Clear filters
            </button>
          )}
        </div>

        {!loading && (
          <p style={{ fontSize: 13, color: '#aaa', marginBottom: 20 }}>
            {filtered.length} {filtered.length === 1 ? 'costume' : 'costumes'} found
            {listingTab === 'rental' && ' available to rent'}
            {listingTab === 'sale' && ' for sale'}
          </p>
        )}

        {/* Skeleton loading */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ borderRadius: 16, background: '#f2e8d5', height: 320 }} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>{listingTab === 'rental' ? '🔄' : '👗'}</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#4a0e2e', marginBottom: 8 }}>
              {listingTab === 'rental' ? 'No rental costumes yet' : search ? 'No results found' : 'No costumes found'}
            </h3>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 28 }}>
              {listingTab === 'rental' ? 'Be the first to list a costume for rent!'
                : search ? `No costumes match "${search}" — try different keywords or clear your filters.`
                : 'Try adjusting your filters.'}
            </p>
            <Link href="/list" style={{ background: '#800020', color: 'white', padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
              List a Costume
            </Link>
          </div>
        )}

        {/* Listings grid */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {filtered.map(listing => {
              const isRental = listing.listing_type === 'rental';
              const images = listing.images || [];
              return (
                <Link key={listing.id} href={`/listings/${listing.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ borderRadius: 16, overflow: 'hidden', background: 'white', boxShadow: '0 2px 12px rgba(74,14,46,0.07)', border: listing.featured ? '2px solid #c49a2a' : '1px solid #f0e8d8', transition: 'transform 0.15s, box-shadow 0.15s', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(74,14,46,0.13)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(74,14,46,0.07)'; }}>
                    <div style={{ aspectRatio: '1', backgroundColor: '#f2e8d5', position: 'relative', overflow: 'hidden' }}>
                      {images.length > 0
                        ? <img src={images[0]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52 }}>👗</div>
                      }
                      <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {listing.featured && <span style={{ background: '#c49a2a', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>⭐ Featured</span>}
                        {isRental
                          ? <span style={{ background: '#2e7d32', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>🔄 Rent</span>
                          : <span style={{ background: '#800020', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>🏷️ Sale</span>
                        }
                      </div>
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#4a0e2e', marginBottom: 4, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {listing.title}
                      </h3>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                        {listing.genre && <span style={{ fontSize: 11, color: '#888', background: '#f5f0ea', padding: '2px 8px', borderRadius: 10 }}>{listing.genre}</span>}
                        {listing.size && <span style={{ fontSize: 11, color: '#888', background: '#f5f0ea', padding: '2px 8px', borderRadius: 10 }}>{listing.size}</span>}
                      </div>
                      {isRental ? (
                        <div>
                          <p style={{ fontSize: 16, fontWeight: 800, color: '#2e7d32' }}>
                            ${listing.rental_price_per_week}<span style={{ fontSize: 11, fontWeight: 500, color: '#888' }}> NZD/wk</span>
                          </p>
                          {listing.rental_min_weeks > 1 && <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>Min. {listing.rental_min_weeks} wks</p>}
                        </div>
                      ) : (
                        <p style={{ fontSize: 16, fontWeight: 800, color: '#800020' }}>
                          ${listing.price}<span style={{ fontSize: 11, fontWeight: 500, color: '#888' }}> NZD</span>
                        </p>
                      )}
                      {listing.location && <p style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>📍 {listing.location}</p>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
