import React from "react";
import LoadingIndicatorBar from "./loading/LoadingProgessBar";
import {
  SplashContainer,
  SplashLogo,
  SplashMessage,
  SplashLoaderWrapper,
} from "./styled/splashScreen";

const SplashScreen: React.FC = () => {
  return (
    <SplashContainer>
      <SplashLogo src="/backgrounds/skylynxNet.png" alt="Skylynx Logo" />
      <SplashMessage variant="h6">Preparing your portal...</SplashMessage>
      <SplashLoaderWrapper>
        <LoadingIndicatorBar />
      </SplashLoaderWrapper>
    </SplashContainer>
  );
};

export default SplashScreen;
