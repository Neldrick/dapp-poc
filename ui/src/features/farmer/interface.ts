import { RiceType } from '../common/models/enum'
import { IRequestItem } from '../common/models/interface'

export interface FarmerState {
  isUnHaverstListExpand: boolean
  isHoldingExpand: boolean
  isPriceListExpand: boolean
  isRequestListExpand: boolean

  isCreateFormOpen: boolean
  isHarvestFormOpen: boolean
  isApproveRequestFormOpen: boolean
  selectedRequestItem: IRequestItem | null
  selectedBalance: IFramerHolding | null
}
export interface FarmerContextValue {
  state: FarmerState
  dispatch: React.Dispatch<Partial<FarmerState>>
}

export interface IFramerHolding {
  riceType: RiceType
  balance: number
  startDate: number
  endDate: number
}
