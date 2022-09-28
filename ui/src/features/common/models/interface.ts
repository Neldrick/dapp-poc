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