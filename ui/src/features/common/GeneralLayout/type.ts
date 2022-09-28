import { AbstractConnector } from '@web3-react/abstract-connector'

export type ActivateFunction = (
  connector: AbstractConnector,
  onError?: (error: Error) => void,
  throwErrors?: boolean
) => Promise<void>
