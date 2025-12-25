import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic'; // Ensure fresh data on every request

export async function GET() {
    try {
        const products = await getProducts();
        // Simple filter to exclude rows without ID if needed, or return all
        return NextResponse.json(products);
    } catch (error: any) {
        console.error('Error in /api/products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products', details: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}
