import { memo, useCallback } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { initialArtifactData, useArtifact } from "@/hooks/use-artifact";
import { Button } from "../ui/button";
import { CrossIcon } from "./icons";

function PureArtifactCloseButton() {
  const { setArtifact } = useArtifact();
  const handleClick = useCallback(() => {
    setArtifact((currentArtifact) =>
      currentArtifact.status === "streaming"
        ? {
            ...currentArtifact,
            isVisible: false,
          }
        : { ...initialArtifactData, status: "idle" }
    );
  }, [setArtifact]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="rounded-lg"
          data-testid="artifact-close-button"
          onClick={handleClick}
          size="icon"
          type="button"
          variant="secondary"
        >
          <CrossIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Close</TooltipContent>
    </Tooltip>
  );
}

export const ArtifactCloseButton = memo(PureArtifactCloseButton, () => true);
