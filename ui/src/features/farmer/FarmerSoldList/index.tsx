/** @jsx jsx */
import React, { useContext, useEffect, useState } from 'react'
import { jsx } from '@emotion/react'
import { Button } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { Column, Table } from 'react-virtualized'
import { Provider } from 'src/core/network/web3/provider'
import { getEnumKeyByEnumValue } from 'src/core/utils'
import { AppContext } from 'src/features/common/contexts/appContext'
import { RiceType } from 'src/features/common/models/enum'
import { generalStyles } from '../constants'
import { useFarmer } from '../context'
import { IFarmerSoldItem } from '../interface'
import { getSoldItemList } from './dataFormatter'

const FarmerSoldList = () => {
  const styling = generalStyles()
  const { tradeContract } = useContext(AppContext)
  const { account } = useWeb3React<Provider>()
  const { isSoldExpand, setIsSoldExpand } = useFarmer()
  const [soldList, setSoldList] = useState<IFarmerSoldItem[]>([])
  useEffect(() => {
    if (tradeContract) {
      tradeContract.getSellerSoldList(account).then((arr: any[]) => {
        setSoldList(getSoldItemList(arr))
      })
    }
  }, [account, tradeContract])
  return (
    <div css={styling.container}>
      <h4 css={styling.tableTitle}> Sold</h4>
      <Button css={styling.tableCollapse} onClick={() => setIsSoldExpand(!isSoldExpand)}>
        {isSoldExpand ? 'Collapse' : 'Expand'}
      </Button>
      <hr />
      {isSoldExpand && (
        <Table
          width={900}
          height={250}
          headerHeight={20}
          rowHeight={40}
          rowCount={soldList.length}
          rowGetter={({ index }) => soldList[index]}
          style={{ padding: '5px' }}
          rowStyle={{ borderBottom: '1px solid black' }}
        >
          <Column
            width={80}
            label="Type"
            dataKey="riceType"
            cellRenderer={({ cellData }) => getEnumKeyByEnumValue(RiceType, cellData)}
          />
          <Column width={100} label="Buyer" dataKey="buyer" />
          <Column width={90} label="Price" dataKey="price" />
          <Column width={90} label="Amount" dataKey="amount" />
          <Column
            width={180}
            label="Start Date"
            dataKey="startDate"
            cellRenderer={({ cellData }) => new Date(cellData).toDateString()}
          />
          <Column
            width={180}
            label="End Date"
            dataKey="endDate"
            cellRenderer={({ cellData }) => new Date(cellData).toDateString()}
          />
          <Column
            width={180}
            label="Sold Time"
            dataKey="soldTime"
            cellRenderer={({ cellData }) => new Date(cellData).toDateString()}
          />
        </Table>
      )}
    </div>
  )
}
export default FarmerSoldList
