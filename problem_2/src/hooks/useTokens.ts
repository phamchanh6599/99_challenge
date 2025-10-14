import { useState, useEffect } from "react"
import type { Token } from "@/types/token"
import { TOKENS } from "@/lib/tokens"

interface UseTokensReturn {
  tokens: Token[]
  loading: boolean
}

export function useTokens(): UseTokensReturn {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPrices = async (): Promise<void> => {
      setTokens(TOKENS)
      setLoading(false)
    }

    loadPrices()
  }, [])

  return { tokens, loading }
}
