import { Copy, Check } from "lucide-react"
import { useState, useEffect, memo } from "react"

import { Button } from "@/app/components/ui"

const GenerateUrlButton = () => {
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (isCopied) {
      timeoutId = setTimeout(() => setIsCopied(false), 3000)
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isCopied])

  return (
    <Button variant="outline" type="submit" onClick={() => setIsCopied(true)}>
      Generate Url
      {isCopied ? (
        <Check className="ml-2 size-4 shrink-0 text-green-600" />
      ) : (
        <Copy className="ml-2 size-4 shrink-0" />
      )}
    </Button>
  )
}

export default memo(GenerateUrlButton)
