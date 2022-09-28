import React, { useState } from 'react'
import { Contract, Signer } from 'ethers'
import { storageKey } from 'src/core/constants'
import { IAppContext } from '../models/interface'
import { ChildProps } from '../models/types'

export const AppContextProvider: React.FC<ChildProps> = ({ children }) => {
  const storedColorMode = localStorage.getItem(storageKey)
  const [colorMode, setColorMode] = useState(storedColorMode)
  const [isGlobalLoading, setGlobalLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [signer, setSigner] = useState<Signer | null>(null)
  const [tradeContract, setTradeContract] = useState<Contract | null>(null)

  const onChangeColorMode = (mode: string) => {
    localStorage.set(storageKey, mode)
    setColorMode(mode)
  }
  const stateValue = {
    isGlobalLoading,
    setGlobalLoading,
    colorMode,
    onChangeColorMode,
    isConnected,
    setIsConnected,
    signer,
    setSigner,
    tradeContract,
    setTradeContract,
  }
  return <AppContext.Provider value={stateValue}>{children}</AppContext.Provider>
}

export const AppContext = React.createContext<IAppContext>({
  isGlobalLoading: false,
  setGlobalLoading: (value: boolean) => {
    console.log(value)
  },
  isConnected: false,
  setIsConnected(value) {
    console.log(value)
  },
  colorMode: '',
  onChangeColorMode: (mode: string) => {
    console.log(mode)
  },
  signer: null,
  setSigner: (value) => {
    console.log(value)
  },
  tradeContract: null,
  setTradeContract: (value) => {
    console.log(value)
  },
})
