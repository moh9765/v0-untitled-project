import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const result = await sql`
      SELECT 
        p.*,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'url', pi.url,
              'isThumbnail', pi.is_thumbnail
            )
          ) FILTER (WHERE pi.url IS NOT NULL),
          '[]'::json
        ) as images,
        (
          SELECT url FROM product_images 
          WHERE product_id = p.id AND is_thumbnail = true 
          LIMIT 1
        ) as thumbnail
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}