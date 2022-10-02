import { IRequestItemWithType } from '../../interface'

export const getRequestItemWithoutType = (itemWithType: IRequestItemWithType) => {
  return {
    buyer: itemWithType.buyer,
    seller: itemWithType.seller,
    size: itemWithType.size,
    amount: itemWithType.amount,
    price: itemWithType.price,
    startDate: itemWithType.startDate,
    endDate: itemWithType.endDate,
  }
}
