// ================================================
// ✅ Component: DyFormModalDialog
// Description: Renders DyForm inside a modal dialog
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/forms/DyFormModalDialog.tsx
// ================================================

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DyFormRenderer from "../../dyForm/dyFormRenderer";
import { DyFormModalDialogProps } from "../..//dyForm/types";


const DyFormModalDialog: React.FC<DyFormModalDialogProps> = ({
  open,
  onClose,
  title = "Edit Form",
  dyFormTemplate,
  viewModel,
  dataModel,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <DyFormRenderer
          dyFormTemplate={dyFormTemplate}
          viewModel={viewModel}
          dataModel={dataModel}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button type="submit" form="dyform" color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DyFormModalDialog;
