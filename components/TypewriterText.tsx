'use client'

interface TypewriterTextProps {
  text: string
  className?: string
  speedMs?: number
}

export default function TypewriterText({
  text,
  className = '',
  speedMs = 60,
}: TypewriterTextProps) {
  const chars = Array.from(text)

  return (
    <span className={className} aria-label={text}>
      {chars.map((ch, i) => (
        <span
          key={`${i}-${ch}`}
          aria-hidden="true"
          className="typewriter-char"
          style={{ animationDelay: `${i * speedMs}ms` }}
        >
          {ch}
        </span>
      ))}
    </span>
  )
}
