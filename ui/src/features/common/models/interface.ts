import { Contract, Signer } from 'ethers'

export interface IAppContext {
  isGlobalLoading: boolean
  setGlobalLoading: (value: boolean) => void
  colorMode: string | null
  onChangeColorMode: (mode: string) => void
  isConnected: boolean
  setIsConnected: (value: boolean) => void
  signer: Signer | null
  setSigner: (value: Signer | null) => void
  tradeContract: Contract | null
  setTradeContract: (value: Contract | null) => void
}

export interface IPriceItem {
  seller: string
  size: number
  amount: number
  price: number
  startDate: number
  endDate: number
}
export interface IRequestItem {
  buyer: string
  seller: string
  size: number
  amount: number
  price: number
  startDate: number
  endDate: number
}
export interface ISellItem {
  seller: string
  size: number
  amount: number
  price: number
  startDate: number
  endDate: number
}
