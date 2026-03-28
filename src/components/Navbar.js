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
        <Link href="/" className="flex flex-col items-start leading-none">
          <span className="text-white font-bold tracking-widest uppercase" style={{ fontSize: '1rem', letterSpacing: '0.25em' }}>
            Costume
          </span>
          <span className="text-white font-black uppercase" style={{ fontSize: '1.6rem', letterSpacing: '0.25em', marginTop: '-2px' }}>
            Loop
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
