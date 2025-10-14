import type { Token } from "@/types/token"
import { formatNumber } from "@/lib/utils"

interface ExchangeInfoProps {
  fromToken: Token | null
  toToken: Token | null
  fromAmount: string
  toAmount: string
}

export function ExchangeInfo({ fromToken, toToken, fromAmount, toAmount }: ExchangeInfoProps) {
  if (!fromToken || !toToken || !fromAmount || !toAmount) {
    return null
  }

  const rate = Number.parseFloat(toAmount) / Number.parseFloat(fromAmount)
  const slippage = 0.5 // 0.5% slippage tolerance
  const fee = 0.003 // 0.3% fee

  return (
    <div className="space-y-2 p-4 rounded-lg bg-muted/50 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Rate</span>
        <span className="font-medium">
          1 {fromToken.symbol} = {formatNumber(rate, 6)} {toToken.symbol}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Slippage Tolerance</span>
        <span className="font-medium">{slippage}%</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Network Fee</span>
        <span className="font-medium">{(fee * 100).toFixed(2)}%</span>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-muted-foreground">Minimum Received</span>
        <span className="font-medium">
          {formatNumber(Number.parseFloat(toAmount) * (1 - slippage / 100))} {toToken.symbol}
        </span>
      </div>
    </div>
  )
}
