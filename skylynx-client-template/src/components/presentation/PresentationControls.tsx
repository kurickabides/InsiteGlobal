// ================================================
// File: Presentation Controls
// Description: Provides previous and continue controls for the guided presentation flow.
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: InsiteGlobal
// Filename: PresentationControls.tsx
// Type: React TypeScript component file
// ================================================

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { goToNextNode, goToPreviousNode, resetPresentation } from "../../appStore/presentationSlice";
import { useAppDispatch } from "../../appStore/hooks";
import { PresentationNode } from "../../types/presentation";

interface PresentationControlsProps {
  previousNode?: PresentationNode;
  nextNode?: PresentationNode;
  firstNode?: PresentationNode;
}

export function PresentationControls({ previousNode, nextNode, firstNode }: PresentationControlsProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handlePrevious = () => {
    if (!previousNode) return;
    dispatch(goToPreviousNode());
    navigate(previousNode.path);
  };

  const handleNext = () => {
    if (!nextNode) return;
    dispatch(goToNextNode());
    navigate(nextNode.path);
  };

  const handleRestart = () => {
    dispatch(resetPresentation());
    if (firstNode) {
      navigate(firstNode.path);
    }
  };

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
      <Button disabled={!previousNode} onClick={handlePrevious} startIcon={<ArrowBackIcon />} variant="outlined">
        Previous
      </Button>
      {nextNode ? (
        <Button endIcon={<ArrowForwardIcon />} onClick={handleNext} variant="contained">
          Continue
        </Button>
      ) : (
        <Button onClick={handleRestart} startIcon={<RestartAltIcon />} variant="contained">
          Restart
        </Button>
      )}
    </Stack>
  );
}
