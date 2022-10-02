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
import { generalStyles } from '../constants'
import { useFarmer } from '../context'
import { IFarmerHolding } from '../interface'
import HarvestForm from './HarvestForm'

const UnHarvestList = () => {
  const styling = generalStyles()
  const { tradeContract } = useContext(AppContext)
  const { account } = useWeb3React<Provider>()
  const [unHarvestList, setUnHarvestList] = useState<IFarmerHolding[]>([])
  const {
    isUnHaverstListExpand,
    setIsUnHaverstListExpand,
    setSelectedBalance,
    setIsClaimFormOpen,
  } = useFarmer()
  useEffect(() => {
    if (tradeContract) {
      tradeContract.getUnharvestBalance(account).then((result: any[]) => {
        setUnHarvestList(
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
    (rowData: IFarmerHolding) => {
      setIsClaimFormOpen(true)
      setSelectedBalance(rowData)
    },
    [setIsClaimFormOpen, setSelectedBalance]
  )
  return (
    <div css={styling.container}>
      <h4 css={styling.tableTitle}> UnHarvest Balance</h4>
      <Button
        css={styling.tableCollapse}
        onClick={() => setIsUnHaverstListExpand(!isUnHaverstListExpand)}
      >
        {isUnHaverstListExpand ? 'Collapse' : 'Expand'}
      </Button>
      <hr />
      {isUnHaverstListExpand && (
        <Table
          width={800}
          height={250}
          headerHeight={20}
          rowHeight={40}
          rowCount={unHarvestList.length}
          rowGetter={({ index }) => unHarvestList[index]}
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
                Harvest
              </Button>
            )}
          />
        </Table>
      )}
      <HarvestForm />
    </div>
  )
}
export default UnHarvestList
