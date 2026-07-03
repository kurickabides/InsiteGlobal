import { UserProfileField } from "../../components/auth/types";

export interface UserProfileFormProps {
  fields: UserProfileField[];
  onSave: (fields: UserProfileField[]) => void;
  onChange: (fields: UserProfileField[]) => void;

