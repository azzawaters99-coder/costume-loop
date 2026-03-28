'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const genres = ['Ballet', 'Contemporary', 'Jazz & Tap', 'Cultural & Character', 'Acrobatics', 'Hip Hop', 'Musical Theatre'];
const conditions = ['New with tags', 'Like new', 'Good', 'Fair'];

export default function BrowsePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [maxPrice, setMaxPrice] = useState(500);

  useEffect(() => {
    fetchListings();
  }, []);

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf7f2' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-sm mb-4" style={{ color: '#800020' }}>{filtered.length} results</p>
        <div className="flex gap-6">
          <aside className="w-56 flex-shrink-0">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold" style={{ color: '#4a0e2e' }}>Filters</h3>
                <button onClick={() => { setSelectedGenres([]); setSelectedConditions([]); setMaxPrice(500); }} className="text-xs" style={{ color: '#800020' }}>Reset</button>
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
          </aside>
          <main className="flex-1">
            {loading ? (
              <div className="text-center py-20 text-gray-400">Loading listings...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">No listings found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(listing => (
                  <div key={listing.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <div className="h-48 flex items-center justify-center" style={{ backgroundColor: '#f2e8d5' }}>
                      <span className="text-5xl">👗</span>
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
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
