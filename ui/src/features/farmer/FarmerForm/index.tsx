/** @jsx jsx */
import React from 'react'
import { jsx } from '@emotion/react'
import { generalStyles } from '../constants'
import { FarmerProvider } from '../context'
import FarmerHolidingList from '../FarmerHoldingList'
import FarmerPriceList from '../FarmerPriceList'
import FarmerRequestList from '../FarmerRequestList'
import UnHarvestList from '../UnHarvestList'
const FarmerForm = () => {
  const styling = generalStyles()
  return (
    <div css={styling.farmerFormContainer}>
      <FarmerProvider>
        <UnHarvestList />
        <FarmerHolidingList />
        <FarmerPriceList />
        <FarmerRequestList />
      </FarmerProvider>
    </div>
  )
}

export default FarmerForm
