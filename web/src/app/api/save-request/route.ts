import { NextResponse } from 'next/server';
import { addProductRequest } from '@/lib/googleSheets';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productName, details } = body;

        if (!productName) {
            return NextResponse.json(
                { message: 'Product Name is required' },
                { status: 400 }
            );
        }

        const success = await addProductRequest(productName, details || '');

        if (success) {
            return NextResponse.json({ message: 'Request saved successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Failed to save request' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
