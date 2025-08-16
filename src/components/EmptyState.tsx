import React from "react";
import { FileImage } from "lucide-react";

export const EmptyState: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-8 sm:p-12 text-center">
      <div className="max-w-sm mx-auto">
        <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <FileImage className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Upload an SVG to get started
        </h3>
        <p className="text-gray-600 text-sm">
          Choose an SVG schematic file and select a theme to see the magic
          happen.
        </p>
      </div>
    </div>
  );
};
