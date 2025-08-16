import React, { useRef, useEffect } from "react";
import type { Theme } from "../types";

interface PreviewComparisonProps {
  svgContent: string;
  styledSvgContent: string;
  selectedTheme: Theme;
}

export const PreviewComparison: React.FC<PreviewComparisonProps> = ({
  svgContent,
  styledSvgContent,
  selectedTheme,
}) => {
  const originalIframeRef = useRef<HTMLIFrameElement>(null);

  // Update original iframe content
  useEffect(() => {
    if (originalIframeRef.current && svgContent) {
      const iframe = originalIframeRef.current;
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  background: #f9fafb; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  min-height: calc(100vh - 40px);
                }
                svg { 
                  max-width: 100%; 
                  height: auto; 
                }
              </style>
            </head>
            <body>
              ${svgContent}
            </body>
          </html>
        `);
        iframeDoc.close();
      }
    }
  }, [svgContent]);

  if (!svgContent) return null;

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
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <iframe
              ref={originalIframeRef}
              className="w-full h-64 sm:h-80 border-0"
              title="Original SVG Preview"
            />
          </div>
        </div>

        {/* Styled SVG */}
        <div className="p-4 sm:p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Styled ({selectedTheme.name})
          </h3>
          <div
            className="rounded-lg p-4 overflow-auto h-64 sm:h-80 flex items-center justify-center bg-current"
            style={
              {
                "--bg-color": selectedTheme.variables["--background-color"],
                backgroundColor: "var(--bg-color)",
              } as React.CSSProperties
            }
          >
            <div
              className="max-w-full max-h-full"
              dangerouslySetInnerHTML={{ __html: styledSvgContent }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
