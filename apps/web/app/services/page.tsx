import Link from 'next/link'

interface ServiceCategory {
  id: string
  name: string
  slug: string
  description: string | null
  iconUrl: string | null
  basePrice: string | null
  estimatedDurationHours: string | null
}

async function getCategories(): Promise<ServiceCategory[]> {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL || 'http://localhost:3000'}/service-categories`,
      { next: { revalidate: 300 } } // cache 5 min
    )
    const data = await res.json()
    return data.success ? data.categories : []
  } catch {
    return []
  }
}

// Fallback emoji icons per slug
const SLUG_ICONS: Record<string, string> = {
  plumbing: '🔧',
  painting: '🎨',
  carpentry: '🪚',
  tiling: '🪟',
  electrical: '⚡',
  cleaning: '🧹',
  'general-repairs': '🔨',
}

export default async function ServicesPage() {
  const categories = await getCategories()

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h1>
        <p className="text-gray-600 mb-8">
          Book a trusted professional for any home repair or maintenance job.
        </p>

        {categories.length === 0 ? (
          <p className="text-gray-500">No services available right now. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/booking?service=${cat.slug}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div className="text-4xl mb-3">
                  {cat.iconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cat.iconUrl} alt={cat.name} className="w-10 h-10 object-contain" />
                  ) : (
                    SLUG_ICONS[cat.slug] ?? '🛠️'
                  )}
                </div>

                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h2>

                {cat.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                )}

                <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                  {cat.basePrice && (
                    <span>From R{Number(cat.basePrice).toFixed(0)}</span>
                  )}
                  {cat.estimatedDurationHours && (
                    <span>~{cat.estimatedDurationHours}h</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 bg-blue-50 rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold text-blue-900 mb-1">Not sure what you need?</h2>
          <p className="text-blue-700 text-sm mb-4">
            Book a general handyman and describe your problem — they&apos;ll figure it out.
          </p>
          <Link
            href="/booking?service=general-repairs"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Book a Handyman
          </Link>
        </div>
      </div>
    </main>
  )
}
