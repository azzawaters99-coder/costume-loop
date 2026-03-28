'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const navLinks = [
    { label: 'Browse', href: '/browse' },
    { label: 'List a Costume', href: '/list' },
    { label: 'For Studios', href: '/for-studios' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
  ];

  return (
    <nav style={{ backgroundColor: '#6B2737' }} className="text-white px-6 py-3 relative">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-start leading-none" style={{ textDecoration: 'none' }}>
          <span className="text-white font-bold uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
            Costume
          </span>
          <span className="font-black uppercase" style={{ fontSize: '2rem', letterSpacing: '0.02em', marginTop: '-4px', lineHeight: '1' }}>
            <span style={{ color: '#ffffff' }}>L</span>
            <span style={{ color: '#c49a2a', fontSize: '2.4rem', position: 'relative', top: '2px' }}>∞</span>
            <span style={{ color: '#ffffff' }}>P</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="hover:text-pink-200 transition-colors">{link.label}</Link>
          ))}
        </div>

        {/* Auth + Mobile hamburger */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/inbox" className="hover:text-pink-200 transition-colors text-sm hidden md:inline">Inbox</Link>
              <Link href="/profile" className="w-8 h-8 rounded-full bg-pink-300 flex items-center justify-center text-burgundy font-bold text-sm">
                {user.email?.[0]?.toUpperCase()}
              </Link>
              <button onClick={handleSignOut} className="text-sm hover:text-pink-200 transition-colors hidden md:inline">Sign Out</button>
            </>
          ) : (
            <Link href="/login" className="bg-white text-pink-900 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-pink-100 transition-colors">
              Sign In
            </Link>
          )}

          {/* Hamburger button - mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 ml-2"
            aria-label="Menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-50 shadow-lg" style={{ backgroundColor: '#6B2737' }}>
          <div className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-3 text-sm font-medium border-b border-white/10 hover:text-pink-200 transition-colors"
                style={{ textDecoration: 'none', color: 'white' }}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  href="/inbox"
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-sm font-medium border-b border-white/10 hover:text-pink-200 transition-colors"
                  style={{ textDecoration: 'none', color: 'white' }}
                >
                  Inbox
                </Link>
                <button
                  onClick={() => { handleSignOut(); setMenuOpen(false); }}
                  className="py-3 text-sm font-medium text-left hover:text-pink-200 transition-colors"
                  style={{ color: 'white' }}
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav style={{ backgroundColor: '#6B2737' }} className="text-white px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex flex-col items-start leading-none" style={{ textDecoration: 'none' }}>
          <span className="text-white font-bold uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
            Costume
          </span>
          <span className="font-black uppercase" style={{ fontSize: '2rem', letterSpacing: '0.02em', marginTop: '-4px', lineHeight: '1' }}>
            <span style={{ color: '#ffffff' }}>L</span>
            <span style={{ color: '#c49a2a', fontSize: '2.4rem', position: 'relative', top: '2px' }}>∞</span>
            <span style={{ color: '#ffffff' }}>P</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/browse" className="hover:text-pink-200 transition-colors">Browse</Link>
          <Link href="/list" className="hover:text-pink-200 transition-colors">List a Costume</Link>
          <Link href="/for-studios" className="hover:text-pink-200 transition-colors">For Studios</Link>
          <Link href="/about" className="hover:text-pink-200 transition-colors">About</Link>
          <Link href="/faq" className="hover:text-pink-200 transition-colors">FAQ</Link>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/inbox" className="hover:text-pink-200 transition-colors text-sm">Inbox</Link>
              <Link href="/profile" className="w-8 h-8 rounded-full bg-pink-300 flex items-center justify-center text-burgundy font-bold text-sm">
                {user.email?.[0]?.toUpperCase()}
              </Link>
              <button onClick={handleSignOut} className="text-sm hover:text-pink-200 transition-colors">Sign Out</button>
            </>
          ) : (
            <Link href="/login" className="bg-white text-pink-900 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-pink-100 transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
