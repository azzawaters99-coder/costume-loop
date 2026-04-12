const KLAVIYO_API = 'https://a.klaviyo.com/api';
const REVISION = '2024-02-15';

function headers() {
  return {
    'Authorization': `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_API_KEY}`,
    'Content-Type': 'application/json',
    'revision': REVISION,
  };
}

export async function upsertProfile({ email, firstName, lastName, properties = {} }) {
  const res = await fetch(`${KLAVIYO_API}/profiles/`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ data: { type: 'profile', attributes: { email, first_name: firstName || '', last_name: lastName || '', properties } } }),
  });
  if (!res.ok && res.status !== 409) console.error('Klaviyo upsertProfile error:', await res.json().catch(()=>({})));
  const data = await res.json().catch(() => ({}));
  return data?.data?.id || null;
}

export async function trackEvent({ email, eventName, properties = {} }) {
  const res = await fetch(`${KLAVIYO_API}/events/`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ data: { type: 'event', attributes: { metric: { data: { type: 'metric', attributes: { name: eventName } } }, profile: { data: { type: 'profile', attributes: { email } } }, properties, time: new Date().toISOString() } } }),
  });
  if (!res.ok) { console.error(`Klaviyo trackEvent (${eventName}) error:`, await res.json().catch(()=>({}))); return false; }
  return true;
}
