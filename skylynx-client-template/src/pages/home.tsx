import React, { FC, ReactElement } from "react";
import { Helmet } from "react-helmet";
import HomeContent from "../components/home/homeContent";
import PageTitle from "../components/ui/gamming/pageTitle";
import { APP_TITLE, PAGE_TITLE_HOME } from "../helpers/constants";
import { FlexRowBetween } from "../theme/appStyles";

const Home: FC = (): ReactElement => {
  return (
    <>
      <Helmet>
        <title>
          {PAGE_TITLE_HOME} | {APP_TITLE}
        </title>
      </Helmet>
      <FlexRowBetween>
        <PageTitle title={PAGE_TITLE_HOME} />
      </FlexRowBetween>
      <HomeContent />
    </>
  );
};

export default Home;
