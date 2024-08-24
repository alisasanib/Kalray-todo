import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent, SelectProps } from "@mui/material/Select";

type Option = {
  value: number;
  label: string;
};

interface CustomSelectProps {
  value: number;
  onChange?: (event: SelectChangeEvent<number>) => void; // Correct type for onChange
  options: Option[];
  style?: React.CSSProperties;
}

const CustomSelect: React.FC<CustomSelectProps> = (props) => {
  return (
    <Select
      sx={props.style}
      labelId='demo-simple-select-label'
      id='demo-simple-select'
      value={props.value}
      label='Age'
      onChange={props.onChange}>
      {props.options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CustomSelect;
