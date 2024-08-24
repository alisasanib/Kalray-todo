import {
  FormControl,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
  InputAdornmentProps,
  OutlinedInputProps,
} from "@mui/material";
import { ReactNode } from "react";

type AdornmentProps = Partial<InputAdornmentProps>;

interface InputProps {
  helperText?: string;
  endIcon?: ReactNode | string;
  startIconProps?: AdornmentProps;
  endIconProps?: AdornmentProps;
  startIcon?: ReactNode | string;
  style?: React.CSSProperties;
  inputProps: Partial<OutlinedInputProps>;
}

const Input = (props: InputProps) => {
  return (
    <FormControl
      sx={{ m: 1, width: "100%", ...props.style }}
      variant='outlined'>
      <OutlinedInput
        {...props.inputProps}
        id='outlined-adornment-weight'
        startAdornment={
          <InputAdornment
            {...props.startIconProps}
            position='start'>
            {props.startIcon}
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment
            {...props.endIconProps}
            position='end'>
            {props.endIcon}
          </InputAdornment>
        }
        aria-describedby='outlined-weight-helper-text'
        inputProps={{
          "aria-label": props.helperText,
        }}
      />
      <FormHelperText id='outlined-weight-helper-text'>{props.helperText}</FormHelperText>
    </FormControl>
  );
};

export default Input;
