import React from 'react'
import BuyerHoldingList from 'src/features/buyer/BuyerHoldingList'
import BuyerPriceList from 'src/features/buyer/BuyerPriceList'
import BuyerRequestList from 'src/features/buyer/BuyerRequestList'
import { BuyerProvider } from 'src/features/buyer/context'

const BuyerPage = () => {
  return (
    <div>
      <h2>Buyer</h2>
      <BuyerProvider>
        <BuyerHoldingList />
        <BuyerRequestList />
        <BuyerPriceList />
      </BuyerProvider>
    </div>
  )
}
export default BuyerPage
