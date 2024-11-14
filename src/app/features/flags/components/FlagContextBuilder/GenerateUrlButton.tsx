import { Copy, Check } from "lucide-react"

import { Button } from "@/app/components/ui"

const GenerateUrlButton = ({ isCopied }: { isCopied: boolean }) => {
  return (
    <Button variant="outline" type="submit">
      Generate Url
      {isCopied ? (
        <Check className="ml-2 size-4 shrink-0 text-green-600" />
      ) : (
        <Copy className="ml-2 size-4 shrink-0" />
      )}
    </Button>
  )
}

export default GenerateUrlButton
