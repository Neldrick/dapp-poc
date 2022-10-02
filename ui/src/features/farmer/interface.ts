import { RiceType } from '../common/models/enum'
import { IRequestItem } from '../common/models/interface'

export interface FarmerState {
  isUnHaverstListExpand: boolean
  isHoldingExpand: boolean
  isSoldExpand: boolean
  isPriceListExpand: boolean
  isRequestListExpand: boolean

  isCreateFormOpen: boolean
  isHarvestFormOpen: boolean
  isApproveRequestFormOpen: boolean
  selectedRequestItem: IRequestItemWithType | null
  selectedBalance: IFarmerHolding | null
}
export interface FarmerContextValue {
  state: FarmerState
  dispatch: React.Dispatch<Partial<FarmerState>>
}

export interface IFarmerSoldItem {
  buyer: string
  riceType: RiceType
  amount: number
  price: number
  startDate: number
  endDate: number
  soldTime: number
}
export interface IFarmerHolding {
  riceType: RiceType
  balance: number
  startDate: number
  endDate: number
}
export interface IRequestItemWithType extends IRequestItem {
  riceType: RiceType
}
