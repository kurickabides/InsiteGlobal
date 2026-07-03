// ================================================
// ✅ Component: Toasted
// File: components/ui/Toasted.tsx
// Description: Renders a styled toast notification for errors or success
// ================================================

import React, { FC } from "react";
import { ToastItem } from "../types";
import {
  ToastSection,
  ToastErrorText,
  ToastSuccessText,
} from "../styled/toastStyles";

const Toasted: FC<{ toastMessage: ToastItem }> = ({ toastMessage }) => {
  const { status, message } = toastMessage;
  const Content = status === "error" ? ToastErrorText : ToastSuccessText;

  return (
    <ToastSection>
      <Content>{message}</Content>
    </ToastSection>
  );
};

export default Toasted;
