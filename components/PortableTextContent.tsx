import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'

interface PortableTextContentProps {
  value: PortableTextBlock[]
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-zinc-200 leading-relaxed mb-4">{children}</p>
    ),
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-white mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-white mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold text-white mt-4 mb-2">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#D4AF37] pl-4 italic text-zinc-300 my-4">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-zinc-200">{children}</em>
    ),
    code: ({ children }) => (
      <code className="bg-[#1a3a5c] text-zinc-100 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white underline hover:text-zinc-300 transition-colors"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 text-zinc-200 mb-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 text-zinc-200 mb-4">
        {children}
      </ol>
    ),
  },
}

export default function PortableTextContent({ value }: PortableTextContentProps) {
  return <PortableText value={value} components={components} />
}
