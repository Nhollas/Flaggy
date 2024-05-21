import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

interface IClientFactory {
  create: (defaultConfig?: AxiosRequestConfig) => AxiosInstance
}

const ClientFactory = (): IClientFactory => ({
  create(defaultConfig?: AxiosRequestConfig) {
    return axios.create(defaultConfig)
  },
})

export default ClientFactory()
