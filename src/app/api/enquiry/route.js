import { NextResponse } from 'next/server';
import { upsertProfile, trackEvent } from '@/lib/klaviyo';

export async function POST(request) {
  try {
    const body = await request.json();
    const { listingId, listingTitle, listingType, listingPrice, listingUrl, sellerEmail, sellerName, buyerName, buyerEmail, buyerPhone, message, enquiryType } = body;

    if (!buyerEmail || !buyerName || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const buyerParts = buyerName.trim().split(' ');
    const sellerParts = (sellerName || '').trim().split(' ');

    const eventProps = { listing_id: listingId, listing_title: listingTitle, listing_type: listingType, listing_price: listingPrice, listing_url: listingUrl, enquiry_type: enquiryType, buyer_name: buyerName, buyer_email: buyerEmail, buyer_phone: buyerPhone || '', seller_name: sellerName || '', seller_email: sellerEmail || '', message };

    await upsertProfile({ email: buyerEmail, firstName: buyerParts[0] || '', lastName: buyerParts.slice(1).join(' ') || '', properties: { phone_number: buyerPhone || '' } });
    await trackEvent({ email: buyerEmail, eventName: 'Enquiry Sent', properties: eventProps });

    if (sellerEmail) {
      await upsertProfile({ email: sellerEmail, firstName: sellerParts[0] || '', lastName: sellerParts.slice(1).join(' ') || '' });
      await trackEvent({ email: sellerEmail, eventName: 'Enquiry Received', properties: eventProps });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Enquiry API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
