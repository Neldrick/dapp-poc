import { RiceType } from '../common/models/enum'
import { ISellItem } from '../common/models/interface'

export interface BuyerState {
  isHoldingExpand: boolean
  isPriceListExpand: boolean
  isRequestListExpand: boolean

  isCreateFormOpen: boolean
  selectedPriceItem: ISellItemWithType | null
}
export interface BuyerContextValue {
  state: BuyerState
  dispatch: React.Dispatch<Partial<BuyerState>>
}

export interface ISellItemWithType extends ISellItem {
  riceType: RiceType
}
