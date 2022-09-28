import React, { useContext, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import MHTArtifact from 'src/assests/MHT.json'
import { contractAddress, issuerAddress } from 'src/core/constants'
import { injected } from 'src/core/network/web3/connectors'
import { Provider } from 'src/core/network/web3/provider'
import IssuerForm from 'src/features/Issuer/IssuerForm'
import { AppContext } from '../contexts/appContext'
import { UserRole } from '../models/enum'
import { getErrorMessage } from './services'
import { ActivateFunction } from './type'

const GeneralLayout: React.FC = () => {
  const context = useWeb3React<Provider>()
  const { active, activate, error, account, library } = context
  const [isActivating, setIsActivating] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>(UserRole.Unkown)
  const [totalValue, setTotalValue] = useState({
    supply: 0,
    farmer: 0,
    buyer: 0,
  })
  const { signer, setSigner, tradeContract, setTradeContract } = useContext(AppContext)
  useEffect(() => {
    async function _activate(activate: ActivateFunction): Promise<void> {
      setIsActivating(true)
      await activate(injected)
      setIsActivating(false)
    }
    if (!(isActivating || active)) {
      _activate(activate)
    }
  }, [activate, active, isActivating])

  useEffect(() => {
    if (!!error) {
      window.alert(getErrorMessage(error))
      setUserRole(UserRole.Unkown)
    }
  }, [error])

  useEffect((): void => {
    if (!library) {
      setSigner(null)
      return
    }
    setSigner(library.getSigner())
  }, [library, setSigner])

  useEffect(() => {
    if (signer) {
      const contractFactory = new ethers.ContractFactory(
        MHTArtifact.abi,
        MHTArtifact.bytecode,
        signer
      )
      const contract = contractFactory.attach(contractAddress)
      setTradeContract(contract)
    } else {
      setTradeContract(null)
    }
  }, [setTradeContract, signer])
  useEffect(() => {
    async function checkUserAndSetRole() {
      if (account) {
        const isFarmer: boolean = await tradeContract?.isAddressSeller(account)
        setUserRole(isFarmer ? UserRole.Farmer : UserRole.Buyer)
      } else {
        setUserRole(UserRole.Buyer)
      }
    }
    if (account) {
      if (account === issuerAddress && userRole !== UserRole.Issuer) {
        setUserRole(UserRole.Issuer)
      }
      if (account !== issuerAddress && tradeContract) {
        checkUserAndSetRole()
      }
    }
  }, [account, tradeContract, userRole])
  useEffect(() => {
    if (tradeContract) {
      Promise.all([
        tradeContract.getTotalSupply(),
        tradeContract.getTotalFarmerBalance(),
        tradeContract.getTotalBuyerBalance(),
      ]).then((values) => {
        setTotalValue({
          supply: values[0],
          farmer: values[1],
          buyer: values[2],
        })
      })
    }
  }, [tradeContract])
  return (
    <>
      {userRole === UserRole.Unkown && <div>Please Install Wallet And Allow to Connect Wallet</div>}
      {userRole === UserRole.Issuer && <IssuerForm totalValue={totalValue} />}
      {userRole === UserRole.Farmer && <div>farmer </div>}
      {userRole === UserRole.Buyer && <div> buyer</div>}
    </>
  )
}
export default GeneralLayout
