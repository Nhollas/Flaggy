import { IClient, fetchWrapper } from "."

const NextApiClient: IClient = {
  fetch: fetchWrapper("/api", {
    headers: {
      "Content-Type": "application/json",
    },
  }),
}

interface INextApiService {
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
