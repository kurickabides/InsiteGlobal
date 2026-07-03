// ================================================
// ✅ Component: StartingPageContent
// File: components/home/StartingPageContent.tsx
// Description: Home page splash screen with welcome image inside PaperContainer
// ================================================

import React from "react";
import { PaperContainer, CenteredMedia } from "../../theme/appStyles";

const StartingPageContent = () => {
  return (
    <PaperContainer>
      <CenteredMedia>
        <img
          src="/content/home.jpg"
          alt="Splash Image"
          style={{
            width: "100%",
            maxWidth: "600px",
            borderRadius: "8px",
          }}
        />
      </CenteredMedia>
    </PaperContainer>
  );
};

export default StartingPageContent;
