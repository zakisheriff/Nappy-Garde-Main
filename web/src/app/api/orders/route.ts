import { NextResponse } from 'next/server';
import { addOrder, recordPromoUsage, checkPromoUsage } from '@/lib/googleSheets';
import { sendWhatsAppNotification } from '../whatsapp/route';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customer, items, total, promoCode } = body;

        // Construct order object
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const date = new Date().toLocaleString();

        const orderData = {
            OrderID: orderId,
            CustomerName: customer.name,
            Phone: customer.phone,
            Address: customer.address,
            ProductsOrdered: items.map((i: any) => `${i.ProductName} (x${i.quantity})`).join('\n'),
            Total: total,
            Date: date,
        };

        // ... existing order logic ...

        // SERVERSIDE FRAUD CHECK:
        // If a promo code is claimed, verify it's valid and unused for this user one last time.
        if (promoCode) {
            const isAlreadyUsed = await checkPromoUsage(customer.phone, customer.address, promoCode);
            if (isAlreadyUsed) {
                return NextResponse.json({ error: 'Promo code invalid or already used.' }, { status: 400 });
            }
        }

        const success = await addOrder(orderData);

        if (success) {
            // Record Promo Usage if applicable
            if (promoCode) {
                await recordPromoUsage(customer.phone, customer.address, promoCode);
            }

            // Send WhatsApp notification to business owner
            sendWhatsAppNotification({
                orderId,
                customerName: customer.name,
                phone: customer.phone,
                address: customer.address,
                items: orderData.ProductsOrdered,
                total,
            }).catch(err => console.error('WhatsApp notification failed:', err));

            return NextResponse.json({ success: true, orderId });
        } else {
            return NextResponse.json({ error: 'Failed to save order to sheet' }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

