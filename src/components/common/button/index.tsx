import Button, { ButtonProps } from "@mui/material/Button";
import "./Button.sass";

const CustomButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button
      className='button'
      {...props}>
      {props.children}
    </Button>
  );
};

export default CustomButton;
