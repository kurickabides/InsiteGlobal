import React, { FC, ReactElement } from "react";
import { PageTitleText } from "../../../theme/appStyles";

const PageTitle: FC<{ title: string }> = ({ title }): ReactElement => {
  return (
    <PageTitleText variant="h4" color="textSecondary">
      {title}
    </PageTitleText>
  );
};

export default PageTitle;
