export type Category = {
  id: string
  parent_id: string | null
  name: string
  slug: string
  image_url: string | null
  is_active: boolean
}

export type Product = {
  id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  base_price: number
  brand: string | null
  is_active: boolean
  created_at: string
}

export type ProductVariant = {
  id: string
  product_id: string
  sku: string
  size: string | null
  color: string | null
  extra_price: number
  is_active: boolean
}

export type ProductImage = {
  id: string
  product_id: string
  url: string
  is_primary: boolean
  sort_order: number
}

export type Inventory = {
  id: string
  variant_id: string
  quantity: number
  reserved_qty: number
  low_stock_at: number
  updated_at: string
}

export type Service = {
  id: string
  name: string
  description: string | null
  price: number | null
  category: string | null
  contact_phone: string | null
  contact_email: string | null
  is_active: boolean
}

export type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  role: string
  created_at: string
}

export type Address = {
  id: string
  user_id: string
  label: string | null
  street: string
  city: string
  pincode: string
}

export type CartItem = {
  id: string
  user_id: string
  variant_id: string
  quantity: number
  added_at: string
}

export type Order = {
  id: string
  user_id: string
  address_id: string | null
  status: string
  subtotal: number
  delivery_fee: number
  total: number
  payment_status: string
  payment_method: string | null
  placed_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  variant_id: string
  quantity: number
  unit_price: number
  line_total: number
}

export type Review = {
  id: string
  user_id: string
  product_id: string
  rating: number
  comment: string | null
  verified_purchase: boolean
  created_at: string
}
