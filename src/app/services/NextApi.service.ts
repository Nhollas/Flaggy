import { IClient, IService } from "."

interface FetchConfig extends RequestInit {
  baseUrl?: string
}

function createFetchWrapper(defaultConfig: FetchConfig) {
  return function (
    input: string | URL | Request,
    init?: RequestInit | undefined,
  ) {
    const combinedConfig = { ...defaultConfig, ...init }

    return fetch(input, combinedConfig)
  }
}

const NextApiClient: IClient = {
  fetch: createFetchWrapper({
    baseUrl: "/api",
    headers: {
      "Content-Type": "application/json",
    },
  }),
}

interface INextApiService extends IService {
  clearContext(): Promise<Response>
}

const NextApiService = (): INextApiService => ({
  clearContext() {
    return NextApiClient.fetch("/flag/context/clear", {
      method: "GET",
    })
  },
})

export default NextApiService()
