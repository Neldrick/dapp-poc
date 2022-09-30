/** @jsx jsx */
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { jsx } from '@emotion/react'
import { Button } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { Column, Table } from 'react-virtualized'
import { Provider } from 'src/core/network/web3/provider'
import { getEnumKeyByEnumValue } from 'src/core/utils'
import { AppContext } from 'src/features/common/contexts/appContext'
import { RiceType } from 'src/features/common/models/enum'
import CreatePriceForm from '../CreatePriceForm'
import { contentStyles } from './constants'
import { useFarmerHolding } from './context'
import { IFramerHolding } from './interface'

const FarmerHolidingList = () => {
  // 1. get data from block chain
  const styling = contentStyles()
  const { tradeContract } = useContext(AppContext)
  const { account } = useWeb3React<Provider>()
  const [holdingList, setHoldingList] = useState<IFramerHolding[]>([])
  const { setSelectedBalance, setIsCreateFormOpen } = useFarmerHolding()
  useEffect(() => {
    if (tradeContract) {
      tradeContract.getSellerTypeBalance(account).then((result: any[]) => {
        setHoldingList(
          result.map((x: any) => {
            return {
              balance: parseInt(x.balance._hex ?? '0', 16),
              startDate: parseInt(x.startDate._hex ?? '0', 16),
              endDate: parseInt(x.endDate._hex ?? '0', 16),
              riceType: x.riceType,
            }
          })
        )
      })
    }
  }, [account, tradeContract])
  const handleActionClick = useCallback(
    (rowData: IFramerHolding) => {
      setIsCreateFormOpen(true)
      setSelectedBalance(rowData)
    },
    [setIsCreateFormOpen, setSelectedBalance]
  )
  return (
    <div css={styling.container}>
      <h4> Holding</h4>
      <hr />
      <Table
        width={800}
        height={250}
        headerHeight={20}
        rowHeight={40}
        rowCount={holdingList.length}
        rowGetter={({ index }) => holdingList[index]}
        style={{ padding: '5px' }}
        rowStyle={{ borderBottom: '1px solid black' }}
      >
        <Column
          width={100}
          label="Type"
          dataKey="riceType"
          cellRenderer={({ cellData }) => getEnumKeyByEnumValue(RiceType, cellData)}
        />
        <Column width={150} label="Balance" dataKey="balance" />
        <Column
          width={200}
          label="Start Date"
          dataKey="startDate"
          cellRenderer={({ cellData }) => new Date(cellData).toDateString()}
        />
        <Column
          width={200}
          label="End Date"
          dataKey="endDate"
          cellRenderer={({ cellData }) => new Date(cellData).toDateString()}
        />
        <Column
          width={150}
          label=""
          dataKey="action"
          cellRenderer={({ rowData }) => (
            <Button variant="contained" onClick={() => handleActionClick(rowData)}>
              Create Price
            </Button>
          )}
        />
      </Table>
      <CreatePriceForm />
    </div>
  )
}
export default FarmerHolidingList