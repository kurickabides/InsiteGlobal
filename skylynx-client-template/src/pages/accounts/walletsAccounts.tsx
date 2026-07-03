// ================================================
// ✅ Component: WalletPage
// File: components/eth/WalletPage.tsx
// Description: Displays Ethereum wallet page with page title and card
// ================================================

import React, { FC, ReactElement } from "react";
import { Helmet } from "react-helmet";
//import ETHWalletCard from "../../components/userAccounts/ethWalletCard"; // ETH wallet card component
import PageTitle from "../../components/ui/gamming/pageTitle";  // Shared page title component

// Constants
import { APP_TITLE, SUBPAGE_TITLE_ETH } from "../../helpers/constants";

// Shared Styles
import { FlexRowBetween } from "../../theme/appStyles"; // Flex layout for the page

const WalletPage: FC<{}> = (): ReactElement => {
  return (
    <>
      <Helmet>
        <title>
          {SUBPAGE_TITLE_ETH} | {APP_TITLE}
        </title>
      </Helmet>

      {/* Layout container with shared FlexRowBetween */}
      <FlexRowBetween>
        {/* Page title as shared component */}
        <PageTitle title={SUBPAGE_TITLE_ETH} />
      </FlexRowBetween>
    </>
  );
};

export default WalletPage;
