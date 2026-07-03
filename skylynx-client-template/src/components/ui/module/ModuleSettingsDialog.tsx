// ================================================
// ✅ Component: ModuleSettingsDialog
// Description: Dynamically renders form for any module settings interface
// Notes:
// - Uses generic type to support any SkylynxModuleSettings extension
// - Syncs local state with incoming settings to reflect live updates
// - Supports boolean, enum, string, and fallback rendering
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/ui/module/ModuleSettingsDialog.tsx
// ================================================

import React, { FC, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  RadioGroup,
  FormLabel,
  Radio,
  FormControl,
  MenuItem,
  Select,
  Box,
} from "@mui/material";
import {
  SkylynxModuleSettings,
  ModuleSettingsDialogProps,
} from "../types/uiWrappers";

// ✅ Enum field config for known setting keys
const enumFields: Record<string, string[]> = {
  layoutVariant: ["grid", "list", "table"],
  viewMode: ["compact", "expanded", "minimal"],
};

// ✅ Determines whether a field is one of the enum types
const isEnumField = (key: string, value: any): boolean =>
  typeof value === "string" && enumFields[key] !== undefined;

const ModuleSettingsDialog = <TSettings extends SkylynxModuleSettings>({
  open,
  settings,
  onSave,
  onClose,
}: ModuleSettingsDialogProps<TSettings>): JSX.Element => {
  // ✅ Local copy of settings used for editing inside dialog
  const [localSettings, setLocalSettings] = useState<TSettings>(settings);

  // ✅ Sync prop changes into local state when dialog is reopened with new settings
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (field: string, value: any) => {
    setLocalSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => onSave(localSettings);

  // ✅ Dynamic renderer for each settings field
  const renderField = (key: string, value: any) => {
    if (key === "id") return null;

    // ✅ Custom handling for known fields
    if (key === "title") {
      return (
        <TextField
          key={key}
          label="Title"
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
          fullWidth
          margin="normal"
        />
      );
    }

    if (key === "showTitle") {
      return (
        <FormControlLabel
          key={key}
          control={
            <Switch
              checked={!!value}
              onChange={(e) => handleChange(key, e.target.checked)}
            />
          }
          label="Show Title"
        />
      );
    }

    // ✅ Boolean values → toggle switch
    if (typeof value === "boolean") {
      return (
        <FormControlLabel
          key={key}
          control={
            <Switch
              checked={value}
              onChange={(e) => handleChange(key, e.target.checked)}
            />
          }
          label={key.replace(/([A-Z])/g, " $1")}
        />
      );
    }

    // ✅ Enum values → radio buttons
    if (isEnumField(key, value)) {
      return (
        <FormControl key={key} component="fieldset" margin="normal">
          <FormLabel>{key.replace(/([A-Z])/g, " $1")}</FormLabel>
          <RadioGroup
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            row
          >
            {enumFields[key].map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );
    }

    // ✅ Array of values → dropdown
    if (Array.isArray(value)) {
      return (
        <FormControl key={key} fullWidth margin="normal">
          <FormLabel>{key.replace(/([A-Z])/g, " $1")}</FormLabel>
          <Select
            value={value[0]}
            onChange={(e) => handleChange(key, e.target.value)}
          >
            {value.map((opt: string) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    // ✅ Default fallback → text field
    return (
      <TextField
        key={key}
        label={key.replace(/([A-Z])/g, " $1")}
        value={value}
        onChange={(e) => handleChange(key, e.target.value)}
        fullWidth
        margin="normal"
      />
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Module Settings</DialogTitle>
      <DialogContent dividers>
        {Object.entries(localSettings).map(([key, value]) => (
          <Box key={key} sx={{ mb: 2 }}>
            {renderField(key, value)}
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModuleSettingsDialog;
