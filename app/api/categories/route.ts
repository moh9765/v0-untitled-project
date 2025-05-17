// app/api/categories/route.ts
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const result = await sql`
      SELECT 
        c.id,
        c.name,
        c.name_ar as "nameAr",
        c.icon,
        json_agg(json_build_object(
          'id', s.id,
          'name', s.name,
          'nameAr', s.name_ar,
          'categoryId', s.category_id
        )) as subcategories
      FROM product_categories c
      LEFT JOIN product_subcategories s ON c.id = s.category_id
      GROUP BY c.id
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}