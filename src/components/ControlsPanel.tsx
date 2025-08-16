import React from "react";
import { FileUpload } from "./FileUpload";
import { ThemeSelector } from "./ThemeSelector";
import { MarginControls } from "./MarginControls";
import { ErrorDisplay } from "./ErrorDisplay";
import type { Theme, Margins } from "../types";

interface ControlsPanelProps {
  // File upload props
  fileName: string;
  isDragOver: boolean;
  onFileUpload: (file: File) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;

  // Theme props
  themes: Theme[];
  selectedTheme: Theme;
  onThemeSelect: (theme: Theme) => void;

  // Margin props
  margins: Margins;
  onMarginsChange: (margins: Margins) => void;

  // Error props
  error: string;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  fileName,
  isDragOver,
  onFileUpload,
  onDragOver,
  onDragLeave,
  onDrop,
  themes,
  selectedTheme,
  onThemeSelect,
  margins,
  onMarginsChange,
  error,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File Upload */}
        <FileUpload
          fileName={fileName}
          isDragOver={isDragOver}
          onFileUpload={onFileUpload}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        />

        {/* Theme Selector */}
        <ThemeSelector
          themes={themes}
          selectedTheme={selectedTheme}
          onThemeSelect={onThemeSelect}
        />

        {/* Margin Controls */}
        <MarginControls margins={margins} onMarginsChange={onMarginsChange} />
      </div>

      {/* Error Display */}
      <ErrorDisplay error={error} />
    </div>
  );
};
