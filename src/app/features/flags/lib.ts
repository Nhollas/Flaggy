import { cookies } from "next/headers"
import { cache } from "react"

import { getFlagContextRequestSchema } from "./schemas"
import { FlagContext } from "./types"

export const getFlagContext = cache(async (): Promise<FlagContext> => {
  const cookieList = cookies()

  const featureContextCookie = cookieList.get("featureContext")

  if (!featureContextCookie) return { contexts: [] }

  try {
    const featureContext = await getFlagContextRequestSchema.parseAsync(
      featureContextCookie.value,
    )

    return featureContext
  } catch (error) {
    return { contexts: [] }
  }
})

/*
  Input examples:

  1. single context
  {
    contexts: [
      {
        contextKind: 'user',
        contextKey: 'user-123',
        attributes: {
          email: 'user-123@gmail.com',
          phone: '1234567890'
        }
      },
    ]
  }

  2. multiple contexts
  {
    contexts: [
      {
        contextKind: 'user',
        contextKey: 'user-123',
        attributes: {
          email: 'user-123@gmail.com'
        }
      },
      {
        contextKind: 'purchase',
        contextKey: 'purchase-123',
        attributes: {
          productInstanceId: '1234'
        }
      },
    ]
  }

*/

/*
  Output example:

  1. single context
  const context = {
    kind: 'user',
    key: 'user-123',
    email: 'user-123@gmail.com',
    phone: '1234567890'
  }

  2. multiple contexts
  const context = {
    kind: 'multi',
    user: {
      key: 'user-123',
      email: 'user-123@gmail.com'
    },
    purchase: {
      key: 'purchase-123',
      productInstanceId: '1234'
    }
  }

*/

export interface IFeatureFlagProvider {
  getValue<T>(
    flag: string,
    flagContext: FlagContext,
    defaultValue: T,
  ): Promise<T>
}
