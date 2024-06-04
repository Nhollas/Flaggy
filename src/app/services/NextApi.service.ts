import { IClient, fetchWrapper } from "."

const NextApiClient: IClient = {
  fetch: fetchWrapper({
    baseUrl: "/api",
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
