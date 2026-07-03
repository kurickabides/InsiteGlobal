import { styled } from "@mui/material/styles";
import { Card, CardContent } from "@mui/material";

export const GalleryCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: "20rem",
  margin: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

export const GalleryCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
}));

export const GalleryImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "auto",
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

export const GalleryLabel = styled("div")(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: "bold",
  fontSize: "1rem",
  marginTop: theme.spacing(1),
}));
export const GalleryContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(3),
  justifyContent: "flex-start",
  padding: theme.spacing(2),
}));

export const GalleryDescription = styled("p")(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  marginTop: theme.spacing(1),
}));
