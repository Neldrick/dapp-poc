/** @jsx jsx */
import React from 'react'
import { jsx } from '@emotion/react'
import { TextField } from '@mui/material'
import { contentStyles } from './constants'
const AmountCompareBox = ({
  value,
  firstLabel,
  secondLabel,
}: {
  firstLabel: string
  secondLabel: string
  value: { firstValue: number; secondValue: number }
}) => {
  const styling = contentStyles()
  return (
    <div css={styling.container}>
      <TextField
        css={styling.firstBox}
        id="outlined-basic"
        label={firstLabel}
        variant="outlined"
        disabled
        value={value.firstValue}
      />
      <TextField
        css={styling.secondBox}
        id="outlined-basic"
        label={secondLabel}
        variant="outlined"
        disabled
        value={value.secondValue}
      />
      {value.secondValue > value.firstValue && <h5>{`${secondLabel} exceed ${firstLabel}`}</h5>}
    </div>
  )
}
export default AmountCompareBox
