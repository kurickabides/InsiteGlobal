// ================================================
// ✅ Component: UserProfileForm
// Description: Dynamically renders profile fields from UserProfileField[]
// ================================================

import React, { FC, FormEvent } from "react";
import { Button, CardHeader } from "@mui/material";
import { UserProfileFormProps } from "./types";
import { Actions, Input } from "../theme/appStyles";
import {
  AuthCard,
  AuthCardContent,
  AuthLabel,
} from "../components/auth/styled/authForm";

const UserProfileForm: FC<UserProfileFormProps> = ({
  fields,
  onSave,
  onChange,
}) => {
  const handleFieldChange = (index: number, value: string) => {
    const updated = [...fields];
    updated[index].FieldValue = value;
    onChange(updated);
  };

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    onSave(fields);
  };

  return (
    <AuthCard>
      <CardHeader title="Edit Profile" />
      <form onSubmit={submitHandler}>
        {fields.length === 0 ? (
          <p>No profile fields available.</p>
        ) : (
          fields.map((field, index) => (
            <AuthCardContent key={field.FieldID}>
              <AuthLabel htmlFor={field.FieldID}>{field.FieldName}</AuthLabel>
              <Input
                id={field.FieldID}
                value={field.FieldValue}
                onChange={(e) => handleFieldChange(index, e.target.value)}
              />
            </AuthCardContent>
          ))
        )}
        <Actions>
          <Button type="submit" variant="contained">
            Save Changes
          </Button>
        </Actions>
      </form>
    </AuthCard>
  );
};

export default UserProfileForm;
