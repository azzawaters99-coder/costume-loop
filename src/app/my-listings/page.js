'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function MyListingsPage() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { setLoading(false); return; }
      setUser(session.user);
      supabase.from('listings').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
        .then(({ data }) => { setListings(data || []); setLoading(false); });
    });
  }, []);

  async function handleDelete(id) {
    if (!confirm('Delete this listing?')) return;
    await supabase.from('listings').delete().eq('id', id);
    setListings(l => l.filter(x => x.id !== id));
  }

  async function toggleStatus(id, current) {
    const next = current === 'active' ? 'sold' : 'active';
    await supabase.from('listings').update({ status: next }).eq('id', id);
    setListings(l => l.map(x => x.id === id ? { ...x, status: next } : x));
  }

  if (loading) return <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#faf7f2'}}><p style={{color:'#aaa'}}>Loading...</p></div>;
  if (!user) return <div style={{minHeight:'60vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16,background:'#faf7f2'}}><div style={{fontSize:48}}>🔒</div><h1 style={{fontSize:22,fontWeight:800,color:'#4a0e2e'}}>Sign in to view your listings</h1><Link href="/login?redirect=/my-listings" style={{background:'#800020',color:'white',padding:'12px 28px',borderRadius:10,textDecoration:'none',fontWeight:700}}>Sign In</Link></div>;

  const active = listings.filter(l => l.status === 'active');
  const sold = listings.filter(l => l.status !== 'active');

  return (
    <div style={{minHeight:'100vh',background:'#faf7f2'}}>
      <div style={{maxWidth:800,margin:'0 auto',padding:'40px 24px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32}}>
          <div>
            <h1 style={{fontSize:26,fontWeight:800,color:'#4a0e2e',marginBottom:4}}>My Listings</h1>
            <p style={{color:'#aaa',fontSize:14}}>{listings.length} listing{listings.length!==1?'s':''} total</p>
          </div>
          <Link href="/list" style={{background:'#800020',color:'white',padding:'12px 20px',borderRadius:10,textDecoration:'none',fontWeight:700,fontSize:14}}>+ New Listing</Link>
        </div>
        {listings.length === 0 ? (
          <div style={{textAlign:'center',padding:'80px 24px',background:'white',borderRadius:16,border:'1px solid #e8dcc8'}}>
            <div style={{fontSize:64,marginBottom:16}}>👗</div>
            <h2 style={{fontSize:20,fontWeight:700,color:'#4a0e2e',marginBottom:8}}>No listings yet</h2>
            <p style={{color:'#aaa',marginBottom:24}}>List your first costume and reach buyers across AU & NZ.</p>
            <Link href="/list" style={{background:'#800020',color:'white',padding:'13px 28px',borderRadius:10,textDecoration:'none',fontWeight:700}}>List a Costume</Link>
          </div>
        ) : (
          <>
            {active.length > 0 && <div style={{marginBottom:32}}><h2 style={{fontSize:16,fontWeight:700,color:'#4a0e2e',marginBottom:16}}>Active <span style={{color:'#aaa',fontWeight:400}}>({active.length})</span></h2><div style={{display:'flex',flexDirection:'column',gap:12}}>{active.map(l=><ListingCard key={l.id} listing={l} onDelete={handleDelete} onToggle={toggleStatus}/>)}</div></div>}
            {sold.length > 0 && <div><h2 style={{fontSize:16,fontWeight:700,color:'#4a0e2e',marginBottom:16}}>Sold / Inactive <span style={{color:'#aaa',fontWeight:400}}>({sold.length})</span></h2><div style={{display:'flex',flexDirection:'column',gap:12}}>{sold.map(l=><ListingCard key={l.id} listing={l} onDelete={handleDelete} onToggle={toggleStatus}/>)}</div></div>}
          </>
        )}
      </div>
    </div>
  );
}

function ListingCard({ listing, onDelete, onToggle }) {
  const isRental = listing.listing_type === 'rental';
  const price = isRental ? `$${listing.rental_price_per_week}/wk` : `$${listing.price}`;
  const coverImage = listing.images?.[0];
  const isActive = listing.status === 'active';
  return (
    <div style={{display:'flex',gap:16,background:'white',borderRadius:12,border:'1px solid #e8dcc8',padding:16,alignItems:'center',opacity:isActive?1:0.6}}>
      <div style={{width:72,height:72,borderRadius:8,overflow:'hidden',background:'#f2e8d5',flexShrink:0}}>
        {coverImage?<img src={coverImage} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28}}>👗</div>}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
          <p style={{fontWeight:700,color:'#4a0e2e',fontSize:15,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{listing.title}</p>
          <span style={{fontSize:11,padding:'2px 8px',borderRadius:20,background:isActive?'#e8f5e9':'#f5f5f5',color:isActive?'#2e7d32':'#999',fontWeight:600,flexShrink:0}}>{isActive?'Active':'Sold'}</span>
        </div>
        <p style={{fontSize:13,color:'#888'}}>{listing.genre} · {listing.size} · {isRental?'🔄 Rental':'🏷️ Sale'}</p>
        <p style={{fontSize:15,fontWeight:700,color:'#800020',marginTop:4}}>{price} NZD</p>
      </div>
      <div style={{display:'flex',gap:8,flexShrink:0}}>
        <Link href={`/listings/${listing.id}`} style={{padding:'7px 12px',borderRadius:8,border:'1px solid #e5e5e5',background:'white',fontSize:12,fontWeight:600,color:'#4a0e2e',textDecoration:'none'}}>View</Link>
        <button onClick={()=>onToggle(listing.id,listing.status)} style={{padding:'7px 12px',borderRadius:8,border:'1px solid #e5e5e5',background:'white',fontSize:12,fontWeight:600,color:'#555',cursor:'pointer'}}>{isActive?'Mark Sold':'Reactivate'}</button>
        <button onClick={()=>onDelete(listing.id)} style={{padding:'7px 12px',borderRadius:8,border:'1px solid #fcc',background:'#fff5f5',fontSize:12,fontWeight:600,color:'#c00',cursor:'pointer'}}>Delete</button>
      </div>
    </div>
  );
}
