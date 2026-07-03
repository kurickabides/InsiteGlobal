// ================================================
// ✅ Component: PageWrapper
// Description: Wrapper for Portal Pages (title, layout, metadata)
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/ui/page/pageWrapper.tsx
// ================================================

import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { PageWrapperProps } from "../types/uiWrappers";
import { PageShell, FlexRowBetween } from "../../../theme/appStyles";
import PageTitle from "../gamming/pageTitle";

const PageWrapper: FC<PageWrapperProps> = ({ renderNode, children }) => {
  const title = renderNode?.viewModel?.contextKey || "Untitled Page";

  return (
    <PageShell>
      <Helmet>
        <title>{title} | Skylynx Page</title>
      </Helmet>
      {children}
    </PageShell>
  );
};

export default PageWrapper;
