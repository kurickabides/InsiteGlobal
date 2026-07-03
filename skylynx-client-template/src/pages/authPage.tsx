import React, { FC, ReactElement } from "react";
import { Helmet } from "react-helmet";
import { APP_TITLE, PAGE_TITLE_AUTH } from "../helpers/constants";
import PageTitle from "../components/ui/gamming/pageTitle";
import AuthForm from "../components/auth/authForm";
import { FlexRowBetween, FlexCenterRow } from "../theme/appStyles";

const AuthPage: FC = (): ReactElement => {
  return (
    <>
      <FlexCenterRow>
        <PageTitle title={PAGE_TITLE_AUTH} />
      </FlexCenterRow>
      <AuthForm />
    </>
  );
};
export default AuthPage;
