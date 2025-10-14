import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/atoms/card"
import Button  from "@/components/atoms/button"
import { TokenInput } from "./tokenInput"
import { ArrowDownUp, Info, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/useToast"
import { Toaster } from "@/components/molecules/toaster"
import { useTokens } from "@/hooks/useTokens"
import type { Token } from "@/types/token"

export function SwapForm() {
   const { tokens } = useTokens()
  const { toast } = useToast()

  const [fromToken, setFromToken] = useState<Token | null>(null)
  const [toToken, setToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

   useEffect(() => {
    if (tokens.length > 0 && !fromToken) {
      setFromToken(tokens[0])
      setToToken(tokens[1])
    }
  }, [tokens, fromToken])

  const exchangeRate = fromToken?.price && toToken?.price ? fromToken.price / toToken.price : 0

  useEffect(() => {
    if (fromAmount && !isNaN(Number.parseFloat(fromAmount))) {

      const calculated = (Number.parseFloat(fromAmount) * exchangeRate).toFixed(6)
      setToAmount(calculated)
      setError("")
    } else {
      setToAmount("")
    }
  }, [exchangeRate, fromAmount, fromToken, toToken])

  const handleSwapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
  }

  const handleFromAmountChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value)

      if (value && Number.parseFloat(value) <= 0) {
        setError("Amount must be greater than 0")
      } else if (value && Number.parseFloat(value) > 1000000) {
        setError("Amount exceeds maximum limit")
      } else {
        setError("")
      }
    }
  }

  const handleMaxClick = () => {
    setFromAmount("10.5")
  }

  const handleSwap = async () => {
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setIsLoading(true)
    setError("")

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)

    toast({
      title: "Swap Successful! 🎉",
      description: `Swapped ${fromAmount} ${fromToken?.symbol ?? ""} for ${toAmount} ${toToken?.symbol ?? ""}`,
    })

    setFromAmount("")
    setToAmount("")
  }

const isValid = fromAmount && Number.parseFloat(fromAmount) > 0 && !error

const getSwapButtonText = useCallback(() => {
  if (isLoading) {
    return (
      <span className="flex items-center gap-2">
        <span className="animate-spin">⏳</span>
        Swapping...
      </span>
    )
  }
  
  if (!fromAmount) return "Enter Amount"
  if (error) return "Invalid Amount"
  return "Swap Tokens"
}, [isLoading, fromAmount, error])

if (!fromToken || !toToken) {
  return null
}

  return (
    <>
      <Card className="p-6 shadow-2xl border-2">
        <div className="space-y-4">
          {/* From Token Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">From</span>
              <button
                onClick={handleMaxClick}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Balance: 10.5 {fromToken?.symbol}
              </button>
            </div>
            <TokenInput
              token={fromToken}
              amount={fromAmount}
              onAmountChange={handleFromAmountChange}
              onTokenChange={setFromToken}
              tokens={tokens.length > 0 ? tokens.filter((t) => t.symbol !== toToken?.symbol) : []}
              onMaxClick={handleMaxClick}
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleSwapTokens}
              className="bg-card border-2 border-border rounded-xl p-2 hover:bg-secondary transition-all hover:scale-110 active:scale-95"
              aria-label="Swap tokens"
            >
              <ArrowDownUp className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* To Token Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">To</span>
              <span className="text-muted-foreground">Balance: 0.0 {toToken.symbol}</span>
            </div>
            <TokenInput
              token={toToken}
              amount={toAmount}
              onAmountChange={setToAmount}
              onTokenChange={setToToken}
              tokens={tokens.filter((t) => t.symbol !== fromToken.symbol)}
              readOnly
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Exchange Rate Info */}
          {fromAmount && !error && (
            <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Exchange Rate
                </span>
                <span className="font-medium">
                  1 {fromToken.symbol} = {exchangeRate.toFixed(6)} {toToken.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated Fee</span>
                <span className="font-medium">~$2.50</span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={!isValid || isLoading}
            className={cn("w-full h-14 text-lg font-semibold transition-all", isLoading && "opacity-80")}
            size="lg"
          >
            {getSwapButtonText()}
          </Button>

          {/* Info Banner */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">
              Prices are estimated and may change. Your transaction will revert if the price changes unfavorably by more
              than the slippage tolerance.
            </p>
          </div>
        </div>
      </Card>
      <Toaster />
    </>
  )
}
