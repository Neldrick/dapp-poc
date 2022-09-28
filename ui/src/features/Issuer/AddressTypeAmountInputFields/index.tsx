/** @jsx jsx */
import React from 'react'
import { jsx } from '@emotion/react'
import { FormControl, InputLabel, MenuItem, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { RangeKeyDict } from 'react-date-range'
import DateRangeInput from 'src/components/DateRangeInput'
import { numberEnumToKeyValueArray } from 'src/core/utils'
import { RiceType } from 'src/features/common/models/enum'
import { contentStyles } from './constant'
import { IAddressTypeAmountDate } from './interface'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file

const AddressTypeAmountInputFields = ({
  value,
  onChange,
}: {
  value: IAddressTypeAmountDate
  onChange: (value: IAddressTypeAmountDate) => void
}) => {
  const handleRiceTypeOnChange = (event: SelectChangeEvent<string>) => {
    onChange({ ...value, riceType: Number(event.target.value) as RiceType })
  }
  const handleAddressOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    onChange({ ...value, address: event.target.value })
  }
  const handleAmountOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    onChange({ ...value, amount: Number(event.target.value) })
  }

  const handleDateChange = (rangesByKey: RangeKeyDict) => {
    console.log(rangesByKey.range)
    onChange({
      ...value,
      startDate: rangesByKey.range.startDate?.getTime() ?? 0,
      endDate: rangesByKey.range.endDate?.getTime() ?? 0,
    })
  }
  const styling = contentStyles()
  return (
    <Box css={styling.rowInputField}>
      <TextField
        required
        id="outlined-required"
        label="Farmer Address"
        value={value.address}
        onChange={handleAddressOnChange}
      />
      <FormControl css={styling.select}>
        <InputLabel id="demo-simple-select-label">Rice Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value.riceType.toString()}
          label="riceType"
          onChange={handleRiceTypeOnChange}
        >
          {numberEnumToKeyValueArray(RiceType).map((enumObj) => (
            <MenuItem key={enumObj.key} value={enumObj.value.toString()}>
              {enumObj.key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        css={styling.amountInput}
        required
        id="outlined-required"
        label="Amount"
        value={value.amount}
        onChange={handleAmountOnChange}
      />
      <div css={styling.datepicker}>
        <DateRangeInput
          onChange={handleDateChange}
          value={{ startDate: value.startDate ?? 0, endDate: value.endDate ?? 0 }}
        />
      </div>
    </Box>
  )
}
export default AddressTypeAmountInputFields
