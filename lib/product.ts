import {sql} from "@/lib/db"

export async function getProductById(id: string) {
  const result = await sql`SELECT * FROM products WHERE id = ${id}`
  return result[0] || null
}