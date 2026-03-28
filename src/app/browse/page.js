'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const genres = ['Ballet', 'Contemporary', 'Jazz & Tap', 'Cultural & Character', 'Acrobatics', 'Hip Hop', 'Musical Theatre'];
const conditions = ['New with tags', 'Like new', 'Good', 'Fair'];

function FilterPanel({ selectedGenres, selectedConditions, maxPrice, toggleGenre, toggleCondition, setMaxPrice, onReset }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold" style={{ color: '#4a0e2e' }}>Filters</h3>
        <button onClick={onReset} className="text-xs" style={{ color: '#800020' }}>Reset</button>
      </div>
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#4a0e2e' }}>Genre</p>
        {genres.map(g => (
          <label key={g} className="flex items-center gap-2 text-sm py-1 cursor-pointer">
            <input type="checkbox" checked={selectedGenres.includes(g)} onChange={() => toggleGenre(g)} className="rounded" />
            {g}
          </label>
        ))}
      </div>
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#4a0e2e' }}>Condition</p>
        {conditions.map(c => (
          <label key={c} className="flex items-center gap-2 text-sm py-1 cursor-pointer">
            <input type="checkbox" checked={selectedConditions.includes(c)} onChange={() => toggleCondition(c)} className="rounded" />
            {c}
          </label>
        ))}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#4a0e2e' }}>Max Price: ${maxPrice}</p>
        <input type="range" min={0} max={500} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full" />
      </div>
    </div>
  );
}

export default function BrowsePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => { fetchListings(); }, []);

  async function fetchListings() {
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    else setListings(data || []);
    setLoading(false);
  }

  const filtered = listings.filter(l => {
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase());
    const matchGenre = selectedGenres.length === 0 || selectedGenres.includes(l.genre);
    const matchCondition = selectedConditions.length === 0 || selectedConditions.includes(l.condition);
    const matchPrice = l.price <= maxPrice;
    return matchSearch && matchGenre && matchCondition && matchPrice;
  });

  const toggleGenre = (g) => setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  const toggleCondition = (c) => setSelectedConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const resetFilters = () => { setSelectedGenres([]); setSelectedConditions([]); setMaxPrice(500); };

  const activeFilterCount = selectedGenres.length + selectedConditions.length + (maxPrice < 500 ? 1 : 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf7f2' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Results count + mobile filter button */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm" style={{ color: '#800020' }}>{filtered.length} results</p>

          {/* Mobile filter toggle — hidden on md and above */}
          <button
            onClick={() => setFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ borderColor: '#800020', color: '#800020' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="text-white text-xs rounded-full px-1.5 py-0.5" style={{ backgroundColor: '#800020' }}>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-6">

          {/* Desktop sidebar — hidden on mobile, visible md and above */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <FilterPanel
                selectedGenres={selectedGenres}
                selectedConditions={selectedConditions}
                maxPrice={maxPrice}
                toggleGenre={toggleGenre}
                toggleCondition={toggleCondition}
                setMaxPrice={setMaxPrice}
                onReset={resetFilters}
              />
            </div>
          </aside>

          {/* Listings grid */}
          <main className="flex-1">
            {loading ? (
              <div className="text-center py-20 text-gray-400">Loading listings...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">No listings found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(listing => (
                  <Link key={listing.id} href={`/listings/${listing.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer" style={{ height: '100%' }}>
                      <div className="h-48 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#f2e8d5' }}>
                        {listing.images && listing.images.length > 0 ? (
                          <img src={listing.images[0]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span className="text-5xl">👗</span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-sm" style={{ color: '#4a0e2e' }}>{listing.title}</h3>
                          <span className="font-bold text-sm" style={{ color: '#800020' }}>${listing.price}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{listing.genre} · {listing.size}</p>
                        <p className="text-xs text-gray-400">📍 {listing.location}</p>
                        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f2e8d5', color: '#800020' }}>{listing.condition}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <>
          {/* Dark backdrop */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={() => setFiltersOpen(false)}
          />

          {/* Bottom sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">

            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center px-5 py-3 border-b">
              <h2 className="font-semibold text-lg" style={{ color: '#4a0e2e' }}>Filters</h2>
              <button onClick={() => setFiltersOpen(false)} className="text-gray-400 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter content */}
            <div className="px-5 py-4">
              <FilterPanel
                selectedGenres={selectedGenres}
                selectedConditions={selectedConditions}
                maxPrice={maxPrice}
                toggleGenre={toggleGenre}
                toggleCondition={toggleCondition}
                setMaxPrice={setMaxPrice}
                onReset={resetFilters}
              />
            </div>

            {/* Apply button */}
            <div className="px-5 pb-8 pt-2">
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full py-3 rounded-xl text-white font-semibold"
                style={{ backgroundColor: '#800020' }}
              >
                Show {filtered.length} results
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}