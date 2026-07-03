// ================================================
// ✅ Component: AboutUsPageContent
// File: components/about/AboutUsPageContent.tsx
// Description: Introductory marketing page for CryptoRio's mission and supported blockchain tech
// ================================================

import React from "react";
import clsx from "clsx";
import { Card } from "@mui/material";
import {
  PaperContainer,
  CardRoot,
  FixedHeightCard,
} from "../theme/appStyles";

const AboutUsPageContent = () => {
  return (
    <PaperContainer>
      <h1>Welcome on Board!</h1>
      <CardRoot className={clsx(FixedHeightCard)}>
        <h2>Where we turn the crypto markets into Paradise!</h2>

        <p>
          Let's be honest, the crypto markets can be complicated and hard to
          understand
        </p>

        <p>
          Here at CryptoRio we are focused on the idea that blockchain is the
          future, but still has a ways to go before accepted in the mainstream.
        </p>

        <p>
          Our plan is not to reinvent the wheel, but instead take a hard look at
          the technologies that will help make the blockchain become more the
          norm.
        </p>

        <p>We are most interested in the concept of the decentralized web.</p>

        <p>
          Below is a list of coins that we have our eye on. These projects have
          something that we think fits in with our idea of a decentralized web:
        </p>

        <ol>
          <li>Ethereum</li>
          <li>Compound</li>
          <li>FileCoin</li>
        </ol>

        <p>
          Ethereum is the backbone of the decentralized web. We will start by
          accepting all payments using MetaMask (link coming soon).
        </p>
      </CardRoot>
    </PaperContainer>
  );
};

export default AboutUsPageContent;
