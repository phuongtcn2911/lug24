import * as React from "react";


import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";

export default function MyDateTimePicker({
  label,
  isDisabled,
  value,
  onChange,
  disablePast,
  maxDateTime,
  shouldDisableTime,
  isTimeValid,
  timeAlert}) {



  return (
    <DateTimePicker
      label={label}
      value={value}
      onChange={onChange}
      // renderInput={(params) => <TextField {...params} fullWidth />}
      disabled={isDisabled}
      disablePast={disablePast}
      maxDateTime={maxDateTime || undefined}
      minutesStep={15}
      shouldDisableTime={shouldDisableTime}
      format="DD-MMM-YYYY HH:mm"

      slotProps={{
        textField: {
          fullWidth: true,
          error: !isTimeValid,
          helperText: !isTimeValid ? timeAlert : "",
        }
      }}
    />
  );
}