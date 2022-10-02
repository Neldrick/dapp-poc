import React from 'react'
import IssuerForm from 'src/features/Issuer/IssuerForm'

const IssuerPage = ({
  totalValue,
}: {
  totalValue: {
    supply: number
    farmer: number
    buyer: number
  }
}) => {
  return (
    <div>
      <h2>Issuer</h2>
      <IssuerForm totalValue={totalValue} />
    </div>
  )
}
export default IssuerPage
