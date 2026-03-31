import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id, quantity, added_at,
      product_variants(id, sku, size, color, extra_price,
        products(id, name, slug, base_price,
          product_images(url, is_primary)
        )
      )
    `)
    .eq('user_id', userId)
    .order('added_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ data })
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { variant_id, quantity = 1 } = body

  if (!variant_id) return Response.json({ error: 'variant_id required' }, { status: 400 })

  const supabase = createServerClient()

  // Upsert: if same variant exists, increase quantity
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('variant_id', variant_id)
    .single()

  if (existing) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select()
      .single()
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data })
  }

  const { data, error } = await supabase
    .from('cart_items')
    .insert({ user_id: userId, variant_id, quantity })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ data }, { status: 201 })
}
