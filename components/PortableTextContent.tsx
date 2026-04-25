import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'

interface PortableTextContentProps {
  value: PortableTextBlock[]
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-fg leading-relaxed mb-4">{children}</p>
    ),
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-fg mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-fg mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold text-fg mt-4 mb-2">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-fg my-4">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-fg">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-fg">{children}</em>
    ),
    code: ({ children }) => (
      <code className="bg-surface-raised text-fg px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-fg underline hover:text-fg transition-colors"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 text-fg mb-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 text-fg mb-4">
        {children}
      </ol>
    ),
  },
}

export default function PortableTextContent({ value }: PortableTextContentProps) {
  return <PortableText value={value} components={components} />
}
