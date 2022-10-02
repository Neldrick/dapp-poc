/** @jsx jsx */
import React from 'react'
import { jsx } from '@emotion/react'
import FarmerSoldList from 'src/features/farmer/FarmerSoldList'
import { generalStyles } from '../../features/farmer/constants'
import { FarmerProvider } from '../../features/farmer/context'
import FarmerHolidingList from '../../features/farmer/FarmerHoldingList'
import FarmerPriceList from '../../features/farmer/FarmerPriceList'
import FarmerRequestList from '../../features/farmer/FarmerRequestList'
import UnHarvestList from '../../features/farmer/UnHarvestList'

const FarmerPage = () => {
  const styling = generalStyles()
  return (
    <div css={styling.farmerFormContainer}>
      <h2>Farmer</h2>
      <FarmerProvider>
        <UnHarvestList />
        <FarmerHolidingList />
        <FarmerPriceList />
        <FarmerRequestList />
        <FarmerSoldList />
      </FarmerProvider>
    </div>
  )
}

export default FarmerPage
