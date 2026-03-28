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
            <svg
              viewBox="0 0 60 30"
              style={{ display: 'inline-block', width: '1.6em', height: '0.8em', verticalAlign: 'middle', position: 'relative', top: '-1px' }}
            >
              <path
                d="M15 7C10 7 6 11 6 15s4 8 9 8c4 0 7-2 9-5l2-3 2 3c2 3 5 5 9 5 5 0 9-4 9-8s-4-8-9-8c-4 0-7 2-9 5l-2 3-2-3c-2-3-5-5-9-5z"
                fill="none"
                stroke="#c49a2a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
