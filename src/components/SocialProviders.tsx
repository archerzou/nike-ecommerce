'use client'
import React from 'react'
import Image from 'next/image'

type SocialProvidersProps = { label?: string; mode: 'signin' | 'signup' }

const providers = [
  { name: 'Google', src: '/next.svg', alt: 'Google' },
  { name: 'Apple', src: '/file.svg', alt: 'Apple' },
]

export default function SocialProviders({ label = 'Continue with' }: SocialProvidersProps) {
  const action = label
  return (
    <div className="space-y-3">
      {providers.map((p) => (
        <button
          key={p.name}
          type="button"
          className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-dark-300 px-4 py-3 text-sm font-medium hover:bg-light-200 transition-colors"
          aria-label={`${action} ${p.name}`}
        >
          <Image src={p.src} alt={p.alt} width={18} height={18} />
          <span>
            {action} {p.name}
          </span>
        </button>
      ))}
    </div>
  )
}
