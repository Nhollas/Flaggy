"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/app/components/ui"
import NextApiService from "@/app/services/NextApi.service"

export function ClearContextButton() {
  const router = useRouter()

  const clearContext = async () => {
    await NextApiService.clearContext()
    router.refresh()
  }

  return (
    <Button type="button" onClick={clearContext}>
      Clear Context
    </Button>
  )
}
