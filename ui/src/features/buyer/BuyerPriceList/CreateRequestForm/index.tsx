import React, { useCallback, useContext, useState } from 'react'
import { Button, TextField } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import PopUpDialogs from 'src/components/PopUpDialogs'
import { Provider } from 'src/core/network/web3/provider'
import { AppContext } from 'src/features/common/contexts/appContext'
import { useBuyer } from '../../context'

const CreateRequestForm = () => {
  const { tradeContract } = useContext(AppContext)
  const { account } = useWeb3React<Provider>()
  const { isCreateFormOpen, reset, selectedPriceItem } = useBuyer()
  const [amount, setAmount] = useState(0)
  const onAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setAmount(Number(event.target.value))
    },
    []
  )
  const onCloseForm = useCallback(() => {
    reset()
  }, [reset])

  const handleSubmitClick = useCallback(() => {
    if (Number.isNaN(amount) || amount > (selectedPriceItem?.amount ?? 0)) {
      alert(`Amount over ${selectedPriceItem?.amount}`)
    } else {
      if (tradeContract) {
        const dto = { ...selectedPriceItem, amount, buyer: account }
        delete dto.riceType
        tradeContract.createRequest(selectedPriceItem?.riceType, [dto]).then(() => {
          onCloseForm()
        })
      }
    }
  }, [account, amount, onCloseForm, selectedPriceItem, tradeContract])

  return (
    <PopUpDialogs isOpen={isCreateFormOpen} onClose={onCloseForm}>
      <div>
        <p>How many you want to buy from </p>
        <p>seller:{selectedPriceItem?.seller} </p>
        <p>
          size:{selectedPriceItem?.size} , price:{selectedPriceItem?.price}
        </p>
        <p>
          Which valid between {new Date(selectedPriceItem?.startDate ?? 0).toDateString()} to{' '}
          {new Date(selectedPriceItem?.endDate ?? 0).toDateString()}
        </p>
      </div>

      <TextField label="Amount" value={amount} onChange={onAmountChange} variant="filled" />
      <div>*Maxinum amount is {selectedPriceItem?.amount}</div>
      <div>
        <Button variant="contained" onClick={handleSubmitClick}>
          Submit
        </Button>
      </div>
    </PopUpDialogs>
  )
}
export default CreateRequestForm
