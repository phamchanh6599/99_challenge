import { useState } from "react"
import Input  from "@/components/atoms/input"
import Button  from "@/components/atoms/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/molecules/popover"
import { ChevronDown, Search } from "lucide-react"
import TokenIcon from "@/components/atoms/tokenIcon"
import { cn } from "@/lib/utils"
import type { Token } from "@/types/token"

interface TokenInputProps {
  token: Token 
  amount: string
  onAmountChange: (value: string) => void
  onTokenChange: (token: Token | null) => void
  tokens: Token[]
  readOnly?: boolean
  onMaxClick?: () => void
}

export function TokenInput({
  token,
  amount,
  onAmountChange,
  onTokenChange,
  tokens,
  readOnly = false,
}: TokenInputProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filteredTokens = tokens.filter(
    (t) => t.symbol.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase()),
  )

  const usdValue =
    amount && !isNaN(Number.parseFloat(amount)) ? (Number.parseFloat(amount) * (token?.price ?? 0)).toFixed(2) : "0.00"

  return (
    <div className="bg-secondary/30 rounded-xl p-4 space-y-3 border border-border/50 hover:border-border transition-colors">
      <div className="flex items-center gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-auto p-2 hover:bg-secondary gap-2 font-semibold">
              <TokenIcon symbol={token.symbol || ""} alt={token.symbol} size={32} />
              <span className="text-lg">{token.symbol}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tokens..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {filteredTokens.map((t) => (
                <button
                  key={t.symbol}
                  onClick={() => {
                    onTokenChange(t)
                    setOpen(false)
                    setSearch("")
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-secondary transition-colors"
                >
                  <TokenIcon symbol={t.symbol || ""} alt={t.symbol} size={32} />
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{t.symbol}</div>
                    <div className="text-sm text-muted-foreground">{t.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${t?.price?.toLocaleString()}</div>
                  </div>
                </button>
              ))}
              {filteredTokens.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">No tokens found</div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex-1 text-right">
          <Input
            type="text"
            inputMode="decimal"
            placeholder="0.0"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            readOnly={readOnly}
            className={cn(
              "text-right text-2xl font-semibold border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0",
              readOnly && "cursor-default",
            )}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          ${token.price !== undefined ? token.price.toLocaleString() : "0.00"}
        </span>
        <span className="text-muted-foreground font-medium">≈ ${usdValue}</span>
      </div>
    </div>
  )
}
