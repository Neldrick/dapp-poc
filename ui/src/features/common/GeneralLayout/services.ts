import { UnsupportedChainIdError } from '@web3-react/core'
import { NoEthereumProviderError, UserRejectedRequestError } from '@web3-react/injected-connector'

export function getErrorMessage(error: Error): string {
  let errorMessage: string

  switch (error.constructor) {
    case NoEthereumProviderError:
      errorMessage = `No Ethereum browser extension detected. Please install MetaMask extension.`
      break
    case UnsupportedChainIdError:
      errorMessage = `You're connected to an unsupported network.`
      break
    case UserRejectedRequestError:
      errorMessage = `Please authorize this website to access your Ethereum account.`
      break
    default:
      errorMessage = error.message
  }

  return errorMessage
}
