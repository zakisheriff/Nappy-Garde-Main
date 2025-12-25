import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic'; // Ensure fresh data on every request

export async function GET() {
    try {
        const products = await getProducts();
        // Simple filter to exclude rows without ID if needed, or return all
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
