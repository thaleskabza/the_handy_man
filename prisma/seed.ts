/**
 * Database Seed
 * Run: bun run db:seed
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── Service Categories ─────────────────────────────────────────────────────
  const categories = [
    {
      name: 'Plumbing',
      slug: 'plumbing',
      description: 'Leak repairs, installations, drain cleaning, geyser repairs',
      displayOrder: 1,
      estimatedDurationHours: '2',
      basePrice: '350',
    },
    {
      name: 'Painting',
      slug: 'painting',
      description: 'Interior & exterior painting, touch-ups, feature walls',
      displayOrder: 2,
      estimatedDurationHours: '4',
      basePrice: '500',
    },
    {
      name: 'Carpentry',
      slug: 'carpentry',
      description: 'Furniture repair, installations, custom woodwork, doors & windows',
      displayOrder: 3,
      estimatedDurationHours: '3',
      basePrice: '400',
    },
    {
      name: 'Tiling',
      slug: 'tiling',
      description: 'Floor & wall tiling, tile repairs, grouting',
      displayOrder: 4,
      estimatedDurationHours: '4',
      basePrice: '600',
    },
    {
      name: 'Electrical',
      slug: 'electrical',
      description: 'Wiring, fixture installation, fault finding, DB boards',
      displayOrder: 5,
      estimatedDurationHours: '2',
      basePrice: '450',
    },
    {
      name: 'Cleaning',
      slug: 'cleaning',
      description: 'House cleaning, deep cleaning, move-in/move-out cleaning',
      displayOrder: 6,
      estimatedDurationHours: '3',
      basePrice: '300',
    },
    {
      name: 'General Repairs',
      slug: 'general-repairs',
      description: 'Handyman services, minor repairs, odd jobs around the house',
      displayOrder: 7,
      estimatedDurationHours: '2',
      basePrice: '280',
    },
  ]

  for (const cat of categories) {
    await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    console.log(`  ✓ ${cat.name}`)
  }

  console.log('\n✅ Seed complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
