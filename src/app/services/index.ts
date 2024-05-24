export interface IClient {
  fetch: (url: string, options?: RequestInit) => Promise<Response>
}

export function fetchWrapper(
  baseUrl: string | URL | Request,
  defaultConfig?: RequestInit,
) {
  return (url: string, config?: RequestInit) => {
    const mergedConfig = { ...defaultConfig, ...config }
    return fetch(baseUrl + url, mergedConfig)
  }
}

export interface IService {}
