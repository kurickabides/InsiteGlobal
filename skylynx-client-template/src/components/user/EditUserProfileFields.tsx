// ================================================
// ✅ Component: EditUserProfileFields
// Description: Editable list of profile fields in table form
// ================================================

import React, { FC, useState, ChangeEvent, FormEvent } from "react";
import {
  FormRoot,
  Label,
  Input,
  SectionTitle,
  Actions,
} from "../../theme/appStyles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

import { UserProfileField } from "../auth/types";

interface Props {
  initialFields: UserProfileField[];
  onSubmit: (fields: UserProfileField[]) => void;
}

const EditUserProfileFields: FC<Props> = ({ initialFields, onSubmit }) => {
  const [fields, setFields] = useState<UserProfileField[]>(initialFields);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>, // Explicitly type the event
    index: number
  ): void => {
    const updated = [...fields];
    updated[index].FieldValue = e.target.value;
    setFields(updated);
  };

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(fields);
  };

  return (
    <FormRoot onSubmit={submitHandler}>
      <SectionTitle>Edit Profile Fields</SectionTitle>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Field Name</strong>
            </TableCell>
            <TableCell>
              <strong>Value</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((field, idx) => (
            <TableRow key={field.FieldID}>
              <TableCell>{field.FieldName || field.FieldID}</TableCell>
              <TableCell>
                <Input
                  type="text"
                  value={field.FieldValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e, idx)
                  } // Now event is properly typed
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Actions>
        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
      </Actions>
    </FormRoot>
  );
};

export default EditUserProfileFields;
