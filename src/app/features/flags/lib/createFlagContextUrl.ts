import { FlagContext } from "../types"

type CreateFlagContextUrlArgs = {
  baseUrl: URL
  flagContext: FlagContext
  redirectPath: string
  flagSecret: string
}

export const createFlagContextUrl = ({
  baseUrl,
  flagContext,
  redirectPath,
  flagSecret,
}: CreateFlagContextUrlArgs) => {
  const url = new URL("/api/flag/context", baseUrl)

  const data = JSON.stringify({ contexts: flagContext.contexts })

  url.searchParams.append("data", data)
  url.searchParams.append("secret", flagSecret)
  url.searchParams.append(
    "redirectUrl",
    new URL(redirectPath, baseUrl).toString(),
  )

  return url.toString()
}
