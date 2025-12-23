'use client'

interface HeroVideoProps {
  videoUrl: string
}

export default function HeroVideo({ videoUrl }: HeroVideoProps) {
  return (
    <video
      autoPlay
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover z-0"
      onEnded={(e) => {
        // Opcional: forçar a mostrar l'últim fotograma
        const video = e.currentTarget
        video.currentTime = video.duration
      }}
    >
      <source src={videoUrl} type="video/mp4" />
    </video>
  )
}