import React, { useState } from 'react'
import { TextField } from '@mui/material'
import { DateRange, RangeKeyDict } from 'react-date-range'

const DateRangeInput = ({
  onChange,
  value,
}: {
  onChange: any
  value: { startDate: number; endDate: number }
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleDateChange = (rangesByKey: RangeKeyDict) => {
    onChange(rangesByKey)
  }
  return (
    <div>
      <TextField
        id="filled-basic"
        label="Filled"
        onClick={() => setIsOpen(!isOpen)}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onChange={() => {}}
        variant="filled"
        value={`${new Date(value.startDate).toLocaleDateString('en-US')} - ${new Date(
          value.endDate
        ).toLocaleDateString('en-US')}`}
      />
      {isOpen && (
        <div>
          <DateRange
            showDateDisplay={false}
            ranges={[
              {
                key: 'range',
                startDate: new Date(value.startDate),
                endDate: new Date(value.endDate),
              },
            ]}
            onChange={handleDateChange}
          />
        </div>
      )}
    </div>
  )
}
export default DateRangeInput
