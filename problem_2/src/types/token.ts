export interface Token {
  id: string
  symbol: string
  name: string
  price?: number
}

export interface SwapState {
  fromToken: Token | null
  toToken: Token | null
  fromAmount: string
  toAmount: string
  isLoading: boolean
  error: string | null
}
