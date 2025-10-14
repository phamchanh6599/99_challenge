import {SwapForm} from "@/components/organisms/swapForm"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Token Swap
          </h1>
          <p className="text-muted-foreground">Exchange tokens instantly at the best rates</p>
        </div>
        <SwapForm />
      </div>
    </main>
  )
}
