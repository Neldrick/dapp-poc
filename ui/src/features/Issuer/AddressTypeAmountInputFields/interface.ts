import { RiceType } from 'src/features/common/models/enum'

export interface IAddressTypeAmountDate {
  address: string
  riceType: RiceType
  amount: number
  startDate: number
  endDate: number
}
