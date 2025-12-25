import { NextResponse } from 'next/server';
import { addOrder } from '@/lib/googleSheets';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customer, items, total } = body;

        // Construct order object
        // OrderID can be timestamp or UUID. Using timestamp for simplicity + random.
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

        const success = await addOrder(orderData);

        if (success) {
            return NextResponse.json({ success: true, orderId });
        } else {
            return NextResponse.json({ error: 'Failed to save order to sheet' }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
