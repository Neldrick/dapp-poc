import React from 'react' // , { Suspense, useMemo } from 'react'
import { Web3ReactProvider } from '@web3-react/core'
// import { RouterProvider } from 'react-router-dom'
// import { routerConfig } from 'src/core/route'
import { getProvider } from 'src/core/network/web3/provider'
import { AppContextProvider } from 'src/features/common/contexts/appContext'
import GeneralLayout from 'src/pages/GeneralLayout'

const App: React.FC = () => {
  // const router = useMemo(() => routerConfig, [])
  return (
    <Web3ReactProvider getLibrary={getProvider}>
      <AppContextProvider>
        <GeneralLayout />
      </AppContextProvider>
    </Web3ReactProvider>
  )
}
export default App
