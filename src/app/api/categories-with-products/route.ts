import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const limit = Math.min(Number(searchParams.get('productsPerCategory') ?? 8), 50)

  const supabase = createServerClient()

  // Get all active parent categories
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name, slug, image_url, is_active')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (catError) {
    return Response.json({ error: catError.message }, { status: 500 })
  }

  if (!categories?.length) {
    return Response.json({ data: [] })
  }

  // For each category, fetch its products
  const categoriesWithProducts = await Promise.all(
    categories.map(async (cat) => {
      const { data: products } = await supabase
        .from('products')
        .select(`
          id, name, slug, base_price, brand, description,
          product_images(url, is_primary, sort_order)
        `)
        .eq('category_id', cat.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      return {
        ...cat,
        products: products ?? [],
      }
    })
  )

  return Response.json({ data: categoriesWithProducts })
}
