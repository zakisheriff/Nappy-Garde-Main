import { NextResponse } from 'next/server';

/**
 * CallMeBot WhatsApp Notification API
 * 
 * SETUP INSTRUCTIONS:
 * 1. Save your phone number in .env.local as CALLMEBOT_PHONE (with country code, no + symbol)
 * 2. Save your API key in .env.local as CALLMEBOT_API_KEY
 * 
 * To get your API key:
 * 1. Add the CallMeBot phone to your contacts: +34 644 52 74 88
 * 2. Send this message to CallMeBot on WhatsApp: "I allow callmebot to send me messages"
 * 3. You'll receive your API key in the response
 */

interface OrderNotification {
    orderId: string;
    customerName: string;
    phone: string;
    address: string;
    items: string;
    total: number;
    deliveryCharge?: number;
}

export async function sendWhatsAppNotification(order: OrderNotification): Promise<boolean> {
    const phone = process.env.CALLMEBOT_PHONE;
    const apiKey = process.env.CALLMEBOT_API_KEY;

    if (!phone || !apiKey) {
        console.warn('CallMeBot credentials not configured. Skipping WhatsApp notification.');
        return false;
    }

    // Format the order message
    const message = `🛒 *NEW ORDER!*

📦 Order ID: ${order.orderId}
👤 Customer: ${order.customerName}
📞 Phone: ${order.phone}
📍 Address: ${order.address}

🛍️ *Items:*
${order.items}

💰 *Total: LKR ${order.total.toFixed(2)}*
${order.deliveryCharge ? `(Includes Delivery: LKR ${order.deliveryCharge.toFixed(2)})` : ''}

📅 ${new Date().toLocaleString()}`;

    try {
        // URL encode the message
        const encodedMessage = encodeURIComponent(message);

        // CallMeBot API endpoint
        const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`;

        const response = await fetch(url, {
            method: 'GET',
        });

        if (response.ok) {
            console.log('WhatsApp notification sent successfully');
            return true;
        } else {
            console.error('Failed to send WhatsApp notification:', response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Error sending WhatsApp notification:', error);
        return false;
    }
}

// API route for testing notifications
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const success = await sendWhatsAppNotification(body);

        if (success) {
            return NextResponse.json({ success: true, message: 'Notification sent' });
        } else {
            return NextResponse.json({ success: false, message: 'Failed to send notification' }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
