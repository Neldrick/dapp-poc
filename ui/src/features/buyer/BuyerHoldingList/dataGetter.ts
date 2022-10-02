import { IBuyerHoldingItem } from './interface'

export const getBuyerHoldingFromChain = (objArray: any[]): IBuyerHoldingItem[] => {
  return objArray.map((x) => {
    return {
      seller: x.seller,
      riceType: x.riceType,
      amount: parseInt(x.amount._hex ?? '0', 16),
      price: parseInt(x.price._hex ?? '0', 16),
      startDate: parseInt(x.startDate._hex ?? '0', 16),
      endDate: parseInt(x.endDate._hex ?? '0', 16),
    }
  })
}
