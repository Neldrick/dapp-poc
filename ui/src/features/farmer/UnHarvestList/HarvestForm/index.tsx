import React, { useCallback, useContext } from 'react'
import { Button } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import PopUpDialogs from 'src/components/PopUpDialogs'
import { Provider } from 'src/core/network/web3/provider'
import { AppContext } from 'src/features/common/contexts/appContext'
import { useFarmer } from '../../context'

const HarvestConfirmForm = () => {
  const { isHarvestFormOpen, selectedBalance, reset } = useFarmer()
  const { account } = useWeb3React<Provider>()
  const { tradeContract } = useContext(AppContext)
  const onCloseForm = useCallback(() => {
    reset()
  }, [reset])
  const onSubmitClick = useCallback(() => {
    if (tradeContract && selectedBalance) {
      tradeContract.harvest(account, selectedBalance).then(() => {
        onCloseForm()
      })
    }
  }, [account, onCloseForm, selectedBalance, tradeContract])
  return (
    <PopUpDialogs isOpen={isHarvestFormOpen} onClose={onCloseForm}>
      <div>Confirm to Harvest?</div>
      <Button onClick={onSubmitClick}>Submit</Button>
    </PopUpDialogs>
  )
}
export default HarvestConfirmForm
