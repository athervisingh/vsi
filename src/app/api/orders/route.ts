import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, status, subtotal, delivery_fee, total, payment_status, payment_method, placed_at,
      addresses(street, city, pincode),
      order_items(id, quantity, unit_price, line_total,
        product_variants(sku, size, color,
          products(name, slug)
        )
      )
    `)
    .eq('user_id', userId)
    .order('placed_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ data })
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { address_id, items, payment_method } = body

  if (!items?.length) return Response.json({ error: 'items required' }, { status: 400 })

  const supabase = createServerClient()

  // Calculate totals
  const subtotal: number = items.reduce(
    (sum: number, item: { unit_price: number; quantity: number }) =>
      sum + item.unit_price * item.quantity,
    0
  )
  const delivery_fee = subtotal >= 999 ? 0 : 99
  const total = subtotal + delivery_fee

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      address_id: address_id ?? null,
      subtotal,
      delivery_fee,
      total,
      payment_method: payment_method ?? null,
    })
    .select()
    .single()

  if (orderError) return Response.json({ error: orderError.message }, { status: 500 })

  const orderItems = items.map((item: { variant_id: string; quantity: number; unit_price: number }) => ({
    order_id: order.id,
    variant_id: item.variant_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    line_total: item.unit_price * item.quantity,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) return Response.json({ error: itemsError.message }, { status: 500 })

  return Response.json({ data: order }, { status: 201 })
}
