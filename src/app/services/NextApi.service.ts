import ClientFactory from "./ClientFactory"

import { IClient, IService } from "."

interface INextApiClient extends IClient {}

const NextApiClient: INextApiClient = {
  instance: ClientFactory.create({
    baseURL: "/api",
    headers: {
      "Content-Type": "application/json",
    },
  }),
  createUrl: ClientFactory.baseUrl("/api"),
}

interface INextApiService extends IService {
  clearContext(): Promise<void>
}

const NextApiService = (): INextApiService => ({
  createUrl(path: string) {
    return NextApiClient.createUrl(path)
  },
  clearContext() {
    return NextApiClient.instance.get("/flag/context/clear")
  },
})

export default NextApiService()
