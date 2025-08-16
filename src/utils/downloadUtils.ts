import type { Theme, Margins } from "../types";
import { applySvgStyles, getSvgDimensions, createWrappedSvg } from "./svgUtils";

export const downloadStyledSvg = (
  svgContent: string,
  selectedTheme: Theme,
  margins: Margins,
  fileName: string
): void => {
  if (!svgContent) return;

  const styledSvg = applySvgStyles(svgContent, selectedTheme, margins);
  const dimensions = getSvgDimensions(styledSvg);
  const wrappedSvg = createWrappedSvg(
    styledSvg,
    selectedTheme,
    margins,
    dimensions
  );

  // Calculate total dimensions with margins
  const totalWidth = dimensions.width + margins.left + margins.right;
  const totalHeight = dimensions.height + margins.top + margins.bottom;

  // Create canvas for PNG conversion
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Set high DPI for better quality
  const scale = 2;
  canvas.width = totalWidth * scale;
  canvas.height = totalHeight * scale;
  ctx.scale(scale, scale);

  // Create image from the wrapped SVG
  const img = new Image();
  const svgBlob = new Blob([wrappedSvg], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    // Draw the complete SVG (with background and margins)
    ctx.drawImage(img, 0, 0, totalWidth, totalHeight);

    // Convert to PNG and download
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = `${fileName.replace(".svg", "")}_${selectedTheme.name
            .toLowerCase()
            .replace(/\s+/g, "_")}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
        }
      },
      "image/png",
      0.95
    );

    URL.revokeObjectURL(url);
  };

  img.onerror = () => {
    console.error("Failed to load SVG for PNG conversion");
    URL.revokeObjectURL(url);
  };

  img.src = url;
};
