import React from "react";
import { CanvasSvgRenderer } from "./CanvasSvgRenderer";
import type { Theme, Margins } from "../types";

interface PreviewComparisonProps {
  svgContent: string;
  selectedTheme: Theme;
  margins: Margins;
}

export const PreviewComparison: React.FC<PreviewComparisonProps> = ({
  svgContent,
  selectedTheme,
  margins,
}) => {
  if (!svgContent) return null;

  // Default theme for original preview (neutral colors)
  const originalTheme: Theme = {
    id: "original",
    name: "Original",
    variables: {
      "--text-color": "#000000",
      "--wire-color": "#000000",
      "--part-color": "#000000",
      "--background-color": "#ffffff",
    },
  };

  // No margins for original preview
  const noMargins: Margins = { top: 0, right: 0, bottom: 0, left: 0 };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="border-b px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Preview Comparison
        </h2>
        <p className="text-sm text-gray-600">
          Original vs. Styled with {selectedTheme.name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
        {/* Original SVG */}
        <div className="p-4 sm:p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Original</h3>
          <CanvasSvgRenderer
            svgContent={svgContent}
            theme={originalTheme}
            margins={noMargins}
            className="h-64 sm:h-80"
            maxWidth={400}
            maxHeight={320}
          />
        </div>

        {/* Styled SVG */}
        <div className="p-4 sm:p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Styled ({selectedTheme.name})
          </h3>
          <CanvasSvgRenderer
            svgContent={svgContent}
            theme={selectedTheme}
            margins={margins}
            className="h-64 sm:h-80"
            maxWidth={400}
            maxHeight={320}
          />
        </div>
      </div>
    </div>
  );
};
