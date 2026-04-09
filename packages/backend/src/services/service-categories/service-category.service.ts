/**
 * Service Category Service
 */

import { supabase } from '../../lib/supabase/client'
import type {
  CreateServiceCategoryInput,
  UpdateServiceCategoryInput,
} from '@handy-man/shared/validators'

export async function getAllCategories(activeOnly = true) {
  let query = supabase
    .from('service_categories')
    .select('id, name, slug, description, icon_url, is_active, display_order, estimated_duration_hours, base_price')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (activeOnly) query = query.eq('is_active', true)

  const { data, error } = await query
  if (error) throw error

  return (data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    iconUrl: c.icon_url,
    isActive: c.is_active,
    displayOrder: c.display_order,
    estimatedDurationHours: c.estimated_duration_hours,
    basePrice: c.base_price,
  }))
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createCategory(input: CreateServiceCategoryInput) {
  const { data: existing } = await supabase
    .from('service_categories')
    .select('id, name, slug')
    .or(`name.eq.${input.name},slug.eq.${input.slug}`)
    .maybeSingle()

  if (existing) {
    const field = existing.name === input.name ? 'name' : 'slug'
    return { success: false, error: `A category with that ${field} already exists`, code: 'CONFLICT' }
  }

  const { data: category, error } = await supabase
    .from('service_categories')
    .insert({
      name: input.name,
      slug: input.slug,
      description: input.description,
      icon_url: input.iconUrl,
      display_order: input.displayOrder ?? 0,
      estimated_duration_hours: input.estimatedDurationHours ?? null,
      base_price: input.basePrice ?? null,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }
  return { success: true, category }
}

export async function updateCategory(slug: string, input: UpdateServiceCategoryInput) {
  const { data: existing } = await supabase
    .from('service_categories')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (!existing) {
    return { success: false, error: 'Category not found', code: 'NOT_FOUND' }
  }

  const { data: category, error } = await supabase
    .from('service_categories')
    .update({
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.iconUrl !== undefined && { icon_url: input.iconUrl }),
      ...(input.displayOrder !== undefined && { display_order: input.displayOrder }),
      ...(input.estimatedDurationHours !== undefined && { estimated_duration_hours: input.estimatedDurationHours }),
      ...(input.basePrice !== undefined && { base_price: input.basePrice }),
    })
    .eq('slug', slug)
    .select()
    .single()

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }
  return { success: true, category }
}

export async function toggleCategoryActive(slug: string) {
  const { data: existing } = await supabase
    .from('service_categories')
    .select('id, is_active')
    .eq('slug', slug)
    .maybeSingle()

  if (!existing) {
    return { success: false, error: 'Category not found', code: 'NOT_FOUND' }
  }

  const { data: category, error } = await supabase
    .from('service_categories')
    .update({ is_active: !existing.is_active })
    .eq('slug', slug)
    .select()
    .single()

  if (error) return { success: false, error: error.message, code: 'SERVER_ERROR' }
  return { success: true, category }
}
