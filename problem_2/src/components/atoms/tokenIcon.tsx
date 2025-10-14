import { useState } from "react"
import { Coins } from "lucide-react"

interface TokenIconProps {
  symbol: string
  alt: string
  size?: number
}

export default function TokenIcon({ symbol, alt, size = 24 }: TokenIconProps) {
  const [error, setError] = useState(false)
  
  const iconPath = `/assets/${symbol.toUpperCase()}.svg`

  if (error) {
    return (
      <div
        className="rounded-full bg-secondary/50 flex items-center justify-center border border-border/50"
        style={{ width: size, height: size }}
      >
        <Coins size={size * 0.6} className="text-muted-foreground" />
      </div>
    )
  }

  return (
    <img
      src={iconPath}
      alt={alt}
      width={size}
      height={size}
      onError={() => setError(true)}
      className="rounded-full border border-border/30"
    />
  )
}

export type { TokenIconProps }