import HomePage from "@/pages/HomePage";
import { createServerClient } from "@/lib/supabase-server";
import type { Category } from "@/types";

async function getCategories(): Promise<Category[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("categories")
    .select("id, parent_id, name, slug, image_url, is_active")
    .eq("is_active", true)
    .order("name", { ascending: true });
  return data ?? [];
}

export default async function Page() {
  const categories = await getCategories();
  return <HomePage categories={categories} />;
}
