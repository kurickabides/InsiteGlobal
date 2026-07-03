// ================================================
// ✅ Component: SettingProfile
// File: components/profile/SettingProfile.tsx
// Description: Renders the user profile settings form inside a styled card
// ================================================

import React from "react";
import { CardRoot } from "../../theme/appStyles";
import PasswordResetForm from "./PasswordResetForm";

const SettingProfile = () => {
  return (
    <CardRoot>
      <PasswordResetForm />
    </CardRoot>
  );
};

export default SettingProfile;
