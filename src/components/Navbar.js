'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setProfileOpen(false)
  }

  const navLinks = [
    { label: 'Browse', href: '/browse' },
    { label: 'List a Costume', href: '/list' },
    { label: 'For Studios', href: '/for-studios' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
  ]

  return (
    <nav style={{ backgroundColor: '#6B2737' }} className="text-white px-6 py-3 relative">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo - fixed unicode */}
        <Link href="/" className="flex flex-col items-start leading-none" style={{ textDecoration: 'none' }}>
          <span className="text-white font-bold uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Costume</span>
          <span className="font-black uppercase" style={{ fontSize: '2rem', letterSpacing: '0.02em', marginTop: '-4px', lineHeight: '1' }}>
            <span style={{ color: '#ffffff' }}>L</span>
            <span style={{ color: '#c49a2a', fontSize: '2.4rem', position: 'relative', top: '2px' }}>&#x221E;</span>
            <span style={{ color: '#ffffff' }}>P</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="hover:text-pink-200 transition-colors"
              style={{ color: pathname === link.href ? '#f9c74f' : 'white' }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/inbox" className="hover:text-pink-200 transition-colors text-sm hidden md:inline">Inbox</Link>
              <div ref={profileRef} style={{ position: 'relative' }}>
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="w-8 h-8 rounded-full bg-pink-300 flex items-center justify-center font-bold text-sm"
                  style={{ cursor: 'pointer', border: profileOpen ? '2px solid #c49a2a' : '2px solid transparent', color: '#4a0e2e' }}
                  aria-label="Account menu">
                  {user.email?.[0]?.toUpperCase()}
                </button>
                {profileOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '110%', background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: 200, zIndex: 100, overflow: 'hidden', border: '1px solid #f0e8d8' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0e8d8', background: '#faf7f2' }}>
                      <p style={{ fontSize: 12, color: '#aaa', marginBottom: 2 }}>Signed in as</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#4a0e2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                    </div>
                    {[
                      { label: '👗 My Listings', href: '/my-listings' },
                      { label: '📥 Inbox', href: '/inbox' },
                      { label: '👤 My Profile', href: '/profile' },
                    ].map(item => (
                      <Link key={item.href} href={item.href} onClick={() => setProfileOpen(false)}
                        style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: '#4a0e2e', textDecoration: 'none', borderBottom: '1px solid #f9f5f0', background: 'white', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#faf7f2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                        {item.label}
                      </Link>
                    ))}
                    <button onClick={handleSignOut}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: 14, color: '#800020', background: 'none', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fff5f7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" style={{ fontSize: 14, fontWeight: 500, color: 'white', textDecoration: 'none' }}
                className="hover:text-pink-200 transition-colors">Sign In</Link>
              <Link href="/login?tab=signup"
                style={{ fontSize: 14, fontWeight: 700, background: '#c49a2a', color: '#4a0e2e', padding: '6px 16px', borderRadius: 20, textDecoration: 'none' }}
                className="hover:opacity-90 transition-opacity">Sign Up</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 ml-2" aria-label="Menu">
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-50 shadow-lg" style={{ backgroundColor: '#6B2737' }}>
          <div className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className="py-3 text-sm font-medium border-b border-white/10 hover:text-pink-200 transition-colors"
                style={{ textDecoration: 'none', color: 'white' }}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/my-listings" onClick={() => setMenuOpen(false)} className="py-3 text-sm font-medium border-b border-white/10" style={{ textDecoration: 'none', color: 'white' }}>My Listings</Link>
                <Link href="/inbox" onClick={() => setMenuOpen(false)} className="py-3 text-sm font-medium border-b border-white/10" style={{ textDecoration: 'none', color: 'white' }}>Inbox</Link>
                <button onClick={() => { handleSignOut(); setMenuOpen(false); }} className="py-3 text-sm font-medium text-left" style={{ color: 'white', background: 'none', border: 'none' }}>Sign Out</button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 10, paddingTop: 12 }}>
                <Link href="/login" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.3)', color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Sign In</Link>
                <Link href="/login?tab=signup" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: 8, background: '#c49a2a', color: '#4a0e2e', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
