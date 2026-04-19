'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', displayName: '', bio: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login?redirect=/profile'); return; }
      setUser(session.user);

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, display_name, bio, location')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profile) {
        const [firstName = '', ...rest] = (profile.full_name || '').split(' ');
        setForm({
          firstName,
          lastName: rest.join(' '),
          displayName: profile.display_name || profile.full_name || '',
          bio: profile.bio || '',
          location: profile.location || '',
        });
      }
      setLoading(false);
    }
    load();
  }, [router]);

  async function save() {
    if (!user) return;
    setSaving(true);
    setError('');
    setMessage('');

    const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ').trim();
    const { error: upsertError } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      full_name: fullName || null,
      display_name: form.displayName || fullName || null,
      bio: form.bio || null,
      location: form.location || null,
    });

    if (upsertError) {
      setError('Could not save: ' + upsertError.message);
    } else {
      setMessage('Profile saved');
      setTimeout(() => setMessage(''), 2500);
    }
    setSaving(false);
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 24px', color: '#999' }}>Loading profile…</div>
  );

  const initials = (form.displayName || form.firstName || user?.email || '?')
    .trim()
    .split(/\s+/)
    .map(s => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const inp = { width: '100%', border: '1px solid #e5e5e5', borderRadius: 10, padding: '11px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const lbl = { display: 'block', fontWeight: 600, fontSize: 13, color: '#4a0e2e', marginBottom: 6 };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: '#4a0e2e', marginBottom: 6 }}>Profile Settings</h1>
      <p style={{ color: '#888', marginBottom: 32, fontSize: 14 }}>Signed in as {user?.email}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#800020', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 700, margin: '0 auto 4px' }}>
            {initials || '?'}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={lbl}>First name</label>
            <input value={form.firstName} onChange={e => set('firstName', e.target.value)} style={inp} />
          </div>
          <div>
            <label style={lbl}>Last name</label>
            <input value={form.lastName} onChange={e => set('lastName', e.target.value)} style={inp} />
          </div>
        </div>

        <div>
          <label style={lbl}>Display name</label>
          <input value={form.displayName} onChange={e => set('displayName', e.target.value)} placeholder="How other users will see you" style={inp} />
        </div>

        <div>
          <label style={lbl}>Location</label>
          <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Auckland, NZ" style={inp} />
        </div>

        <div>
          <label style={lbl}>Bio</label>
          <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={4} placeholder="Tell the community about yourself…" style={{ ...inp, resize: 'vertical' }} />
        </div>

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: 10, padding: '10px 14px', fontSize: 14 }}>{error}</div>}
        {message && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a', borderRadius: 10, padding: '10px 14px', fontSize: 14 }}>{message}</div>}

        <button onClick={save} disabled={saving} style={{ background: saving ? '#999' : '#800020', color: 'white', fontWeight: 700, padding: 13, borderRadius: 10, border: 'none', fontSize: 15, cursor: saving ? 'default' : 'pointer' }}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
