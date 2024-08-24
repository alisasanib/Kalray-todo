import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CustomButton from "../button";

interface ModalProps {
  visible: boolean;
  handleClose: () => void;
  onOK: () => void;
  handleCancel?: () => void;
  title?: string;
  content: React.ReactNode;
  oKText?: string;
  cancelText?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  handleClose,
  onOK,
  handleCancel,
  title,
  content,
  oKText = "OK",
  cancelText = "Cancel",
  width = "800px",
  height = "300px",
  maxWidth = "80%",
  maxHeight = "70%",
}) => {
  return (
    <Dialog
      PaperProps={{
        sx: {
          width,
          height,
          maxWidth,
          maxHeight,
          padding: "20px",
        },
      }}
      open={visible}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'>
      {title && <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>{content}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: "flex", gap: "20px" }}>
        {cancelText && (
          <CustomButton
            onClick={handleCancel}
            aria-label='Cancel'>
            {cancelText}
          </CustomButton>
        )}
        <CustomButton
          variant='contained'
          onClick={onOK}
          autoFocus
          aria-label='Confirm'>
          {oKText}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
