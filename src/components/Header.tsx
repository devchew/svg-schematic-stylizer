import React from "react";
import { Palette, Download } from "lucide-react";

interface HeaderProps {
  svgContent: string;
  onDownload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ svgContent, onDownload }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Palette className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                SVG Schematic Stylizer
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                Upload and style your SVG schematics with beautiful themes
              </p>
            </div>
          </div>

          {svgContent && (
            <button
              onClick={onDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
