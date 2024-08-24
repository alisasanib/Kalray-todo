import Switch, { SwitchProps } from "@mui/material/Switch";

interface CustomSwitchProps extends SwitchProps {
  label: string;
}
const CustomSwitch: React.FC<CustomSwitchProps> = (props) => {
  const label = { inputProps: { "aria-label": props.label } };
  return (
    <div>
      <Switch
        {...label}
        {...props}
      />
    </div>
  );
};

export default CustomSwitch;
