import { FormControlLabel, FormControlLabelProps } from "@mui/material";
import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";

interface CustomCheckboxProps {
  checkboxProps?: Partial<CheckboxProps>;
  labelProps?: Partial<FormControlLabelProps>;
}

const CustomCheckbox = (props: CustomCheckboxProps) => {
  const label = { inputProps: { "aria-label": props.labelProps?.label } };
  return (
    <FormControlLabel
      {...props.labelProps}
      control={<Checkbox {...props.checkboxProps} />}
      label={props.labelProps?.label}
    />
  );
};
export default CustomCheckbox;
