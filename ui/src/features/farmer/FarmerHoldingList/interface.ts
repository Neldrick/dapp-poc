import { RiceType } from 'src/features/common/models/enum'

export interface IFramerHolding {
  riceType: RiceType
  balance: number
  startDate: number
  endDate: number
}
