// ================================================
// ✅ Component: ErrorModal
// File: components/ui/ErrorModal.tsx
// Description: Displays error popup with close action
// ================================================

import React from "react";
import Button from "@mui/material/Button";
import { Backdrop, ErrorPopup, ErrorActions } from "../styled/errorModal";

interface ErrorModalProps {
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  onCloseError: React.MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
}

const ErrorModal: React.FC<ErrorModalProps> = React.memo((props) => {
  return (
    <>
      <Backdrop onClick={props.onCloseError} />
      <ErrorPopup>
        <h2>An Error Occurred!</h2>
        <p>{props.children}</p>
        <ErrorActions>
          <Button variant="contained" onClick={props.onClose}>
            Okay
          </Button>
        </ErrorActions>
      </ErrorPopup>
    </>
  );
});

export default ErrorModal;
