// ================================================
// ✅ Component: UserProfilePageLayout
// File: components/user/UserProfilePageLayout.tsx
// Description: Main landing page for viewing/editing user profile fields
// ================================================

import React, { FC, ReactElement } from "react";
import { Helmet } from "react-helmet";
import PageTitle from "../ui/gamming/pageTitle";
import { FormRoot, FlexRowBetween } from "../../theme/appStyles";
import UserProfileDetails from "./UserProfileDetails";
import EditUserProfileFields from "./EditUserProfileFields";
import { APP_TITLE } from "../../helpers/constants";

const UserProfilePageLayout: FC = (): ReactElement => {
  // Sample mock data — should come from store or props
  const mockFields = [
    { FieldID: "FirstName", FieldValue: "John", FieldName: "First Name" },
    { FieldID: "LastName", FieldValue: "Doe", FieldName: "Last Name" },
    { FieldID: "Email", FieldValue: "john.doe@example.com", FieldName: "Email" },
  ];

  const handleSave = (updatedFields: typeof mockFields) => {
    console.log("🔄 Saved profile updates", updatedFields);
    // TODO: Dispatch save action
  };

  return (
    <>
      <Helmet>
        <title>User Profile | {APP_TITLE}</title>
      </Helmet>

      <FormRoot>
        <PageTitle title="User Profile" />
        <FlexRowBetween>
          <div style={{ width: "45%" }}>
            <UserProfileDetails />
          </div>
          <div style={{ width: "45%" }}>
            <EditUserProfileFields initialFields={mockFields} onSubmit={handleSave} />
          </div>
        </FlexRowBetween>
      </FormRoot>
    </>
  );
};

export default UserProfilePageLayout;
