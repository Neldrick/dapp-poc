import React, { useCallback, useContext, useState } from 'react'
import { Button, TextField } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { Column, Table } from 'react-virtualized'
import PopUpDialogs from 'src/components/PopUpDialogs'
import { Provider } from 'src/core/network/web3/provider'
import { setObjectKeyValue } from 'src/core/utils'
import { AppContext } from 'src/features/common/contexts/appContext'
import { useFarmerHolding } from '../FarmerHoldingList/context'
import { ISellItem } from './interface'

const CreatePriceForm = () => {
  const { isCreateFormOpen, selectedBalance, reset } = useFarmerHolding()
  const { account } = useWeb3React<Provider>()
  const { tradeContract } = useContext(AppContext)
  const initData = useCallback(() => {
    return {
      seller: account ?? '',
      size: 1,
      amount: 1,
      price: 1,
      startDate: selectedBalance?.startDate ?? 0,
      endDate: selectedBalance?.endDate ?? 0,
    }
  }, [account, selectedBalance?.endDate, selectedBalance?.startDate])
  const [rowData, setRowData] = useState<ISellItem[]>([initData()])
  const onCloseForm = useCallback(() => {
    setRowData([initData()])
    reset()
  }, [initData, reset])
  const onSubmitClick = useCallback(() => {
    if (tradeContract && selectedBalance) {
      tradeContract.createPriceItemForAHolding(selectedBalance?.riceType, rowData).then(() => {
        onCloseForm()
      })
    }
  }, [onCloseForm, rowData, selectedBalance, tradeContract])

  const onAddRowClick = useCallback(() => {
    setRowData([...rowData, initData()])
  }, [initData, rowData])
  const handleDataOnChange = useCallback(
    (
      event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
      datatKey: string,
      rowIndex: number
    ) => {
      const newData = [...rowData]
      setObjectKeyValue(newData[rowIndex], datatKey as keyof ISellItem, Number(event.target.value))
      setRowData([...newData])
    },
    [rowData]
  )
  const handleRemoveClick = useCallback(
    (rowIndex: number) => {
      if (rowData.length > 1) {
        rowData.splice(rowIndex, 1)
        setRowData([...rowData])
      }
    },
    [rowData]
  )
  return (
    <PopUpDialogs isOpen={isCreateFormOpen} onClose={onCloseForm}>
      <Table
        width={480}
        height={300}
        headerHeight={20}
        rowHeight={60}
        rowCount={rowData.length}
        rowGetter={({ index }) => rowData[index]}
        style={{ padding: '5px' }}
        containerStyle={{ padding: '5px' }}
        rowStyle={{ borderBottom: '1px solid black' }}
      >
        <Column
          width={120}
          label="Size"
          dataKey="size"
          cellRenderer={({ cellData, rowIndex, dataKey }) => (
            <TextField
              required
              id="outlined-required"
              value={cellData}
              onChange={(event) => handleDataOnChange(event, dataKey, rowIndex)}
            />
          )}
        />
        <Column
          width={120}
          label="Amount"
          dataKey="amount"
          cellRenderer={({ cellData, rowIndex, dataKey }) => (
            <TextField
              required
              id="outlined-required"
              value={cellData}
              onChange={(event) => handleDataOnChange(event, dataKey, rowIndex)}
            />
          )}
        />
        <Column
          width={120}
          label="Price"
          dataKey="price"
          cellRenderer={({ cellData, rowIndex, dataKey }) => (
            <TextField
              required
              id="outlined-required"
              value={cellData}
              onChange={(event) => handleDataOnChange(event, dataKey, rowIndex)}
            />
          )}
        />
        <Column
          width={100}
          label=""
          dataKey="action"
          cellRenderer={({ rowIndex }) => (
            <Button variant="contained" color="error" onClick={() => handleRemoveClick(rowIndex)}>
              Remove
            </Button>
          )}
        />
      </Table>
      <Button onClick={onAddRowClick}>Add</Button>
      <Button onClick={onSubmitClick}>Submit</Button>
    </PopUpDialogs>
  )
}

export default CreatePriceForm
