export interface IClient {
  fetch: (url: string, options?: RequestInit) => Promise<Response>
}

export interface IService {}
