import React, { useState } from "react";
import {
  Header,
  ControlsPanel,
  PreviewComparison,
  EmptyState,
} from "./components";
import { themes } from "./data/themes";
import {
  downloadStyledSvg,
  validateSvgFile,
  validateSvgContent,
} from "./utils";
import type { Theme, Margins } from "./types";
import "./App.css";

function App() {
  const [svgContent, setSvgContent] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [margins, setMargins] = useState<Margins>({
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  });

  const handleFileUpload = (file: File) => {
    // Validate file
    const fileError = validateSvgFile(file);
    if (fileError) {
      setError(fileError);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;

      // Validate content
      const contentError = validateSvgContent(content);
      if (contentError) {
        setError(contentError);
        return;
      }

      setSvgContent(content);
      setFileName(file.name);
      setError("");
    };

    reader.onerror = () => {
      setError("Error reading file. Please try again.");
    };

    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDownload = async () => {
    if (!svgContent || isDownloading) return;

    setIsDownloading(true);
    try {
      await downloadStyledSvg(svgContent, selectedTheme, margins, fileName);
    } catch (err) {
      setError("Failed to download file. Please try again.");
      console.error("Download error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        svgContent={svgContent}
        onDownload={handleDownload}
        isDownloading={isDownloading}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls Section */}
        <ControlsPanel
          fileName={fileName}
          isDragOver={isDragOver}
          onFileUpload={handleFileUpload}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          themes={themes}
          selectedTheme={selectedTheme}
          onThemeSelect={setSelectedTheme}
          margins={margins}
          onMarginsChange={setMargins}
          error={error}
        />

        {/* Preview Section */}
        {svgContent && (
          <PreviewComparison
            svgContent={svgContent}
            selectedTheme={selectedTheme}
            margins={margins}
          />
        )}

        {/* Empty State */}
        {!svgContent && !error && <EmptyState />}
      </main>
    </div>
  );
}

export default App;
