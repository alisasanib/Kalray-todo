import Switch, { SwitchProps } from "@mui/material/Switch";

type BasicSwitchProps = SwitchProps & { label: string };

const CustomSwitch = (props: BasicSwitchProps) => {
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
