import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const categorySlug = searchParams.get('category')
  const sort = searchParams.get('sort') ?? 'newest'
  const limit = Math.min(Number(searchParams.get('limit') ?? 20), 100)
  const offset = Number(searchParams.get('offset') ?? 0)

  const supabase = createAdminClient()

  let query = supabase
    .from('products')
    .select(`
      id, category_id, name, slug, description, base_price, brand, is_active, created_at,
      categories!inner(slug),
      product_images(url, is_primary, sort_order)
    `)
    .eq('is_active', true)
    .range(offset, offset + limit - 1)

  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug)
  }

  if (sort === 'newest') {
    query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json({ data })
}
