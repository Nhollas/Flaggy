import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

interface IClientFactory {
  create: (defaultConfig?: AxiosRequestConfig) => AxiosInstance
  baseUrl: (base: string) => (path: string) => string
}

const ClientFactory = (): IClientFactory => ({
  create(defaultConfig?: AxiosRequestConfig) {
    return axios.create(defaultConfig)
  },
  baseUrl(base: string) {
    return (path: string) => `${base}${path}`
  },
})

export default ClientFactory()
