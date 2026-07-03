import React, { FC, ReactElement } from "react";
import { Helmet } from "react-helmet";
import { styled } from "@mui/material/styles";
import { FlexRowBetween } from "../../theme/appStyles"; // theme styles
import XLMWalletCard from "../../components/stellar/accountCard/xlmWalletCard";
import PageTitle from "../../components/ui/gamming/pageTitle";
import { APP_TITLE, PAGE_TITLE_DASHBOARD } from "../../helpers/constants";

const Root = FlexRowBetween;

const StellarDash: FC = (): ReactElement => {
  return (
    <>
      <Helmet>
        <title>
          {PAGE_TITLE_DASHBOARD} | {APP_TITLE}
        </title>
      </Helmet>
      <Root>
        <PageTitle title={PAGE_TITLE_DASHBOARD} />
        <XLMWalletCard />
      </Root>
    </>
  );
};

export default StellarDash;
