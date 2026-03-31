import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET(_req: NextRequest) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('categories')
    .select('id, parent_id, name, slug, image_url, is_active')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json({ data })
}
