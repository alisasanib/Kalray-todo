import Button, { ButtonProps } from "@mui/material/Button";
import './Button.sass';


type CustomButtonProps = ButtonProps;

const CustomButton = (props: CustomButtonProps) => {
  return <Button className="button" {...props}>{props.children}</Button>;
};

export default CustomButton;
