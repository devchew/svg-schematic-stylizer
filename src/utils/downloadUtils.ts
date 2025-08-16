import type { Theme, Margins } from "../types";
import { renderSvgToCanvas, getSvgNaturalDimensions } from "./canvasUtils";

export const downloadStyledSvg = async (
  svgContent: string,
  selectedTheme: Theme,
  margins: Margins,
  fileName: string
): Promise<void> => {
  if (!svgContent) return;

  try {
    // Get natural SVG dimensions
    const naturalDimensions = getSvgNaturalDimensions(svgContent);

    // Calculate total dimensions with margins
    const totalWidth = naturalDimensions.width + margins.left + margins.right;
    const totalHeight = naturalDimensions.height + margins.top + margins.bottom;

    // Render SVG to canvas at high resolution
    const canvas = await renderSvgToCanvas(svgContent, margins, {
      width: totalWidth,
      height: totalHeight,
      scale: 2, // High DPI for better quality
    }, selectedTheme);

    // Convert canvas to blob and download
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${fileName.replace(".svg", "")}_${selectedTheme.name
            .toLowerCase()
            .replace(/\s+/g, "_")}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      },
      "image/png",
      0.95
    );
  } catch (error) {
    console.error("Download failed:", error);
    throw new Error("Failed to download styled SVG");
  }
};
