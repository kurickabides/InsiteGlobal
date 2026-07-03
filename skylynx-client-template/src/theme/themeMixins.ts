// theme/themeMixins.ts
import { CSSObject } from "@mui/material/styles";

const toolbarMixin: CSSObject = {
  minHeight: 64,
  "@media (min-width:0px)": {
    "@media (orientation: landscape)": {
      minHeight: 56,
    },
  },
  "@media (min-width:600px)": {
    minHeight: 64,
  },
};

const ContainerMixins = {
  theme: { spacing: 2 },
  footer: {
    height: 30,
    width: 0,
  },
  header: {
    height: 60,
    width: 0,
  },
  Card: {
    height: 440,
    width: 440,
  },
  drawer: {
    open: {
      height: 0,
      width: 250,
    },
    closed: {
      height: 0,
      width: 75,
    },
  },
  page: {
    height: 0,
    width: 500,
  },
  sketch: {
    height: 300,
    width: 500,
  },
  icons: {
    height: 50,
    width: 50,
  },
  errorWindow: {
    top: "30vh",
    left: "15rem",
    width: "30rem",
  },
  pdfCanvas: {
    width: 800,
    height: 1000,
  },
  markupBox: {
    x: 500,
    y: 700,
    width: 200,
    height: 100,
    fill: "rgba(255,0,0,0.4)",
  },
  markupText: {
    fontSize: 16,
    color: "black",
  },
  toolbar: toolbarMixin,
};

export default ContainerMixins;
