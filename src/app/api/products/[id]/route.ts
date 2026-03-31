import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/products/[id]'>
) {
  const { id } = await ctx.params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      id, category_id, name, slug, description, base_price, brand, is_active, created_at,
      product_variants(id, sku, size, color, extra_price, is_active),
      product_images(id, url, is_primary, sort_order),
      product_attribute_values(value, attributes(name))
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: error.code === 'PGRST116' ? 404 : 500 })
  }
  return Response.json({ data })
}
