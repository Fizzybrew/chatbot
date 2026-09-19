import { Maximize2, Minimize2 } from "lucide-react";
import { memo, useCallback } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useArtifact } from "@/hooks/use-artifact";
import { Button } from "../ui/button";

function PureArtifactFullScreenButton() {
  const { artifact, setArtifact } = useArtifact();
  const handleToggleFullscreen = useCallback(() => {
    setArtifact((prev) => ({
      ...prev,
      isFullscreen: !prev.isFullscreen,
    }));
  }, [setArtifact]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="rounded-lg hidden md:inline-flex"
          data-testid="artifact-full-screen-button"
          onClick={handleToggleFullscreen}
          size="icon"
          type="button"
          variant="secondary"
        >
          {artifact.isFullscreen ? <Minimize2 /> : <Maximize2 />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {artifact.isFullscreen ? "Expand" : "Collapse"}
      </TooltipContent>
    </Tooltip>
  );
}

export const ArtifactFullScreenButton = memo(
  PureArtifactFullScreenButton,
  () => true
);
