import { RiceType } from 'src/features/common/models/enum'
import { IRequestItem } from 'src/features/common/models/interface'

export interface IBuyerRequestItem extends IRequestItem {
  riceType: RiceType
}
export const getBuyerRequestItemFromChain = (
  objArray: any[],
  riceType: RiceType
): IBuyerRequestItem[] => {
  return objArray.map((x) => {
    return {
      riceType,
      buyer: x.buyer,
      seller: x.seller,
      size: parseInt(x.size._hex ?? '0', 16),
      amount: parseInt(x.amount._hex ?? '0', 16),
      price: parseInt(x.price._hex ?? '0', 16),
      startDate: parseInt(x.startDate._hex ?? '0', 16),
      endDate: parseInt(x.endDate._hex ?? '0', 16),
    }
  })
}
