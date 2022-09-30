import { IFramerHolding } from './FarmerHoldingList/interface'

export interface FarmerHoldingState {
  isCreateFormOpen: boolean
  selectedBalance: IFramerHolding | null
}
export interface FarmerHoldingContextValue {
  state: FarmerHoldingState
  dispatch: React.Dispatch<Partial<FarmerHoldingState>>
}
