import React, { FC, ReactElement } from "react";
import { styled } from "@mui/material/styles";
import { FooterRoot } from "../../../theme/appStyles";
import { FOOTER_TEXT } from "../../../helpers/constants";
import { Link } from "@mui/material";

const Root = FooterRoot;

const FooterLink = styled(Link)(({ theme }) => ({
  textTransform: "uppercase",
}));

const Footer: FC = (): ReactElement => {
  return (
    <Root>
      <FooterLink
        href={"http://localhost:3000/"}
        target="_blank"
        rel="noreferrer"
        aria-label="Visit API server"
      >
        {FOOTER_TEXT}
      </FooterLink>
    </Root>
  );
};

export default Footer;
