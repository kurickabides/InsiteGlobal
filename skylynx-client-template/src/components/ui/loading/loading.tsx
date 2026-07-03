import React, { FC } from "react";
import { CircularProgress } from "@mui/material";
import { FlexCenterFull } from "../styled/loading";


const Loading: FC = () => {
  return (
    <FlexCenterFull>
      <CircularProgress color="primary" />
    </FlexCenterFull>
  );
};

export default Loading;
