import React, { useEffect, useRef, useState } from "react";
import {
  renderSvgToCanvas,
  getSvgNaturalDimensions,
} from "../utils/canvasUtils";
import type { Theme, Margins } from "../types";

interface CanvasSvgRendererProps {
  svgContent: string;
  theme: Theme;
  margins: Margins;
  className?: string;
  maxWidth?: number;
  maxHeight?: number;
}

export const CanvasSvgRenderer: React.FC<CanvasSvgRendererProps> = ({
  svgContent,
  theme,
  margins,
  className = "",
  maxWidth = 400,
  maxHeight = 320,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!svgContent || !canvasRef.current) return;

    const renderCanvas = async () => {
      setIsLoading(true);
      setError("");

      try {
        // Get natural SVG dimensions
        const naturalDimensions = getSvgNaturalDimensions(svgContent);

        // Calculate display dimensions with margins
        const totalWidth =
          naturalDimensions.width + margins.left + margins.right;
        const totalHeight =
          naturalDimensions.height + margins.top + margins.bottom;

        // Calculate scale to fit within max dimensions
        const scale = Math.min(
          maxWidth / totalWidth,
          maxHeight / totalHeight,
          1 // Don't scale up beyond original size
        );

        const displayWidth = totalWidth * scale;
        const displayHeight = totalHeight * scale;

        // Render SVG to canvas
        const renderedCanvas = await renderSvgToCanvas(
          svgContent,
          theme,
          margins,
          {
            width: totalWidth,
            height: totalHeight,
            scale: 2, // Higher resolution for crisp display
          }
        );

        // Update the display canvas
        const displayCanvas = canvasRef.current;
        if (displayCanvas) {
          const displayCtx = displayCanvas.getContext("2d");
          if (displayCtx) {
            // Set display size
            displayCanvas.width = displayWidth;
            displayCanvas.height = displayHeight;
            displayCanvas.style.width = `${displayWidth}px`;
            displayCanvas.style.height = `${displayHeight}px`;

            // Draw the rendered canvas scaled down
            displayCtx.drawImage(
              renderedCanvas,
              0,
              0,
              renderedCanvas.width,
              renderedCanvas.height,
              0,
              0,
              displayWidth,
              displayHeight
            );
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Canvas rendering error:", err);
        setError("Failed to render SVG");
        setIsLoading(false);
      }
    };

    renderCanvas();
  }, [svgContent, theme, margins, maxWidth, maxHeight]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg ${className}`}
      >
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 text-sm">Rendering...</div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`max-w-full max-h-full ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-200`}
      />
    </div>
  );
};
