// ================================================
// ✅ Component: BankPage
// Description: Displays bank account list page with page title and card list
// ================================================

import React, { FC, ReactElement } from "react";
import { Helmet } from "react-helmet";
import PageTitle  from "../../components/ui/gamming/pageTitle"; // Shared PageTitle component
import BankAccountCard from "../../components/userAccounts/BankAccountCard"; // Component for bank accounts

// Constants
import { APP_TITLE, SUBPAGE_TITLE_BANK } from "../../helpers/constants";

// Shared Styles
import { FlexRowBetween } from "../../theme/appStyles"; // Layout

const BankPage: FC<{}> = (): ReactElement => {
  return (
    <>
      <Helmet>
        <title>
          {SUBPAGE_TITLE_BANK} | {APP_TITLE}
        </title>
      </Helmet>

      {/* Use FlexRowBetween for layout if needed */}
      <FlexRowBetween>
        {/* Page title as shared component */}
        <PageTitle title={SUBPAGE_TITLE_BANK} />
      </FlexRowBetween>

      {/* Bank account card list */}
      <BankAccountCard />
    </>
  );
};

export default BankPage;
