import { getTranslations, getLocale } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity/client'
import { salasQuery } from '@/lib/sanity/queries'
import type { Sala, Locale } from '@/lib/sanity/types'
import { urlForImage } from '@/lib/sanity/image'

export default async function SalasPage() {
  const [t, locale] = await Promise.all([
    getTranslations(),
    getLocale() as Promise<Locale>,
  ])

  const salas: Sala[] = await client.fetch(salasQuery)

  return (
    <div className="min-h-screen bg-transparent pt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('salas.title')}
          </h1>
          <p className="text-xl text-zinc-400">
            {t('salas.subtitle')}
          </p>
        </div>

        {/* Salas Grid */}
        {salas.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-lg">
              No hi ha sales disponibles
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {salas.map((sala) => {
              const photoUrl = sala.photos?.[0]
                ? urlForImage(sala.photos[0])?.width(600).height(400).url()
                : null

              return (
                <Link
                  key={sala._id}
                  href={`/${locale}/salas/${sala._id}`}
                  className="group bg-[#0a1929]/80 rounded-xl overflow-hidden border border-[#254a6e]/30 hover:border-[#D4AF37]/50 transition-all duration-300"
                >
                  {/* Photo */}
                  <div className="aspect-video relative overflow-hidden">
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={sala.name[locale]}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1a3a5c] flex items-center justify-center">
                        <span className="text-zinc-500 text-6xl">🎧</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                      {sala.name[locale]}
                    </h2>
                    <p className="text-zinc-400 mb-4">
                      {sala.address.city}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-500">
                        {t('salas.capacity')}: {sala.capacity} {t('salas.places')}
                      </span>
                      <span className="text-[#D4AF37] text-sm font-medium group-hover:translate-x-1 transition-transform">
                        {t('salas.viewDetails')} →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
