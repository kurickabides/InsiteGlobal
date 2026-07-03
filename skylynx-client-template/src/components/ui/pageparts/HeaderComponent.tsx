// ================================================
// ✅ Component: HeaderComponent
// File: components/layout/HeaderComponent.tsx
// Description: Renders a fixed SVG header banner
// ================================================

import React, { FC } from "react";
import { styled } from "@mui/material/styles";
import { HeaderComponentProps } from "../types";


const HeaderWrapper = styled("div")<HeaderComponentProps>(
  ({ top = -150, width = "100%", height = "100%" }) => ({
    position: "fixed",
    top,
    left: 0,
    right: 0,
    zIndex: 1200,
    width,
    height,
  })
);

const HeaderComponent: FC<HeaderComponentProps> = ({
  width = "100%",
  height = "100%",
  top = -150,
}) => (
  <HeaderWrapper top={top} width={width} height={height}>
    <img
      src={`${process.env.PUBLIC_URL}/backgrounds/skynet.svg`}
      alt="Skynet"
      style={{ width: "100%", height: "100%" }}
    />
  </HeaderWrapper>
);

export default HeaderComponent;
