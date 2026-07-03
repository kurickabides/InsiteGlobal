// ================================================
// ✅ Component: SettingsPageLayout
// File: components/layout/SettingsPageLayout.tsx
// Description: A layout for settings page with profile details and password reset
// ================================================

import React, { FC, ReactElement } from "react";
import { Helmet } from "react-helmet";
import UserProfileDetails from "../components/user/UserProfileDetails"; // User profile details component
import PasswordResetForm from "../components/staticforms/settingProfile"; // Password reset form component
import PageTitle from "../components/ui/gamming/pageTitle";  // Page title component
import { FormRoot } from "../theme/appStyles"; // Shared form styles

// Constants
import { APP_TITLE, PAGE_TITLE_SETTINGS } from "../helpers/constants";

// Layout styles
import { FlexRowBetween } from "../theme/appStyles"; // Flex layout for spacing

const SettingsPage: FC<{}> = (): ReactElement => {
  return (
    <>
      <Helmet>
        <title>
          {PAGE_TITLE_SETTINGS} | {APP_TITLE}
        </title>
      </Helmet>

      <FormRoot>
        <PageTitle title={PAGE_TITLE_SETTINGS} />

        {/* Profile and Password Reset Section */}
        <FlexRowBetween>
          <div style={{ width: "45%" }}>
            <UserProfileDetails />
          </div>

          <div style={{ width: "45%" }}>
            <PasswordResetForm />
          </div>
        </FlexRowBetween>
      </FormRoot>
    </>
  );
};

export default SettingsPage;
