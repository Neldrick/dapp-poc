import { RiceType } from 'src/features/common/models/enum'

export interface IBuyerHoldingItem {
  seller: string
  riceType: RiceType
  amount: number
  price: number
  startDate: number
  endDate: number
}
