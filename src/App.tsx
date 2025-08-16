import React, { useState, useRef } from "react";
import {
  Upload,
  Palette,
  FileImage,
  AlertCircle,
  Download,
  Maximize2,
} from "lucide-react";
import "./App.css";

interface Theme {
  id: string;
  name: string;
  variables: {
    "--text-color": string;
    "--wire-color": string;
    "--part-color": string;
    "--background-color": string;
  };
}

const themes: Theme[] = [
  {
    id: "neon",
    name: "Neon Blue",
    variables: {
      "--text-color": "#2de2e6",
      "--wire-color": "#ff6c11",
      "--part-color": "#ff3864",
      "--background-color": "#0d0221",
    },
  },
  {
    id: "forest",
    name: "Forest Green",
    variables: {
      "--text-color": "#00ff88",
      "--wire-color": "#ffaa00",
      "--part-color": "#ff4444",
      "--background-color": "#0a1a0a",
    },
  },
  {
    id: "sunset",
    name: "Sunset Orange",
    variables: {
      "--text-color": "#ffdd44",
      "--wire-color": "#ff8800",
      "--part-color": "#ff2244",
      "--background-color": "#2a1810",
    },
  },
  {
    id: "ocean",
    name: "Ocean Blue",
    variables: {
      "--text-color": "#44ddff",
      "--wire-color": "#00aaff",
      "--part-color": "#ff6644",
      "--background-color": "#0a1a2a",
    },
  },
  {
    id: "monochrome",
    name: "Monochrome",
    variables: {
      "--text-color": "#ffffff",
      "--wire-color": "#888888",
      "--part-color": "#cccccc",
      "--background-color": "#1a1a1a",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    variables: {
      "--text-color": "#ff00ff",
      "--wire-color": "#00ffff",
      "--part-color": "#ffff00",
      "--background-color": "#0a0a0a",
    },
  },
  {
    id: "retro",
    name: "Retro Wave",
    variables: {
      "--text-color": "#ff6b9d",
      "--wire-color": "#c44569",
      "--part-color": "#f8b500",
      "--background-color": "#1a0033",
    },
  },
  {
    id: "matrix",
    name: "Matrix Green",
    variables: {
      "--text-color": "#00ff41",
      "--wire-color": "#008f11",
      "--part-color": "#00ff41",
      "--background-color": "#000000",
    },
  },
  {
    id: "arctic",
    name: "Arctic Blue",
    variables: {
      "--text-color": "#e1f5fe",
      "--wire-color": "#81d4fa",
      "--part-color": "#29b6f6",
      "--background-color": "#0d47a1",
    },
  },
  {
    id: "volcano",
    name: "Volcano Red",
    variables: {
      "--text-color": "#ffeb3b",
      "--wire-color": "#ff5722",
      "--part-color": "#f44336",
      "--background-color": "#1a0000",
    },
  },
];

function App() {
  const [svgContent, setSvgContent] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [margins, setMargins] = useState({
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalIframeRef = useRef<HTMLIFrameElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file.type.includes("svg") && !file.name.endsWith(".svg")) {
      setError("Please upload a valid SVG file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("File size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content.includes("<svg")) {
        setSvgContent(content);
        setFileName(file.name);
        setError("");
      } else {
        setError("Invalid SVG file format.");
      }
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const applySvgStyles = (svgString: string, theme: Theme) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = doc.querySelector("svg");

    if (svgElement) {
      // Apply theme variables as CSS custom properties
      Object.entries(theme.variables).forEach(([property, value]) => {
        svgElement.style.setProperty(property, value);
      });

      // Apply background color and margins
      svgElement.style.backgroundColor = theme.variables["--background-color"];
      svgElement.style.padding = `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`;

      // Apply the styling rules
      const style = doc.createElement("style");
      style.textContent = `
        svg {
          background-color: var(--background-color);
        }
        
        text {
          fill: var(--text-color) !important;
          filter: drop-shadow(1px 0px 8px var(--text-color));
        }
        
        [fill="#FFFFFF"] { 
          fill: var(--background-color) !important; 
        }
        
        [stroke="#000000"], [stroke="#A54B4B"] { 
          stroke: var(--part-color) !important; 
        }
        
        [c_etype="wire"] { 
          stroke: var(--wire-color) !important; 
        }
        
        [stroke="#FF0000"] { 
          stroke: var(--part-color) !important; 
        }
        
        [c_partid="part_junction"] circle { 
          fill: var(--wire-color) !important; 
        }
        
        [stroke="#880000"], [stroke="#8D2323"] { 
          stroke: var(--part-color) !important; 
        }
      `;

      svgElement.insertBefore(style, svgElement.firstChild);
    }

    return new XMLSerializer().serializeToString(doc);
  };

  const downloadStyledSvg = () => {
    if (!svgContent) return;

    const styledSvg = applySvgStyles(svgContent, selectedTheme);

    // Parse the styled SVG to get dimensions
    const parser = new DOMParser();
    const doc = parser.parseFromString(styledSvg, "image/svg+xml");
    const svgElement = doc.querySelector("svg");

    if (!svgElement) return;

    // Get SVG dimensions from viewBox or width/height attributes
    let svgWidth = 800;
    let svgHeight = 600;

    if (svgElement.viewBox && svgElement.viewBox.baseVal) {
      svgWidth = svgElement.viewBox.baseVal.width;
      svgHeight = svgElement.viewBox.baseVal.height;
    } else {
      const width = svgElement.getAttribute("width");
      const height = svgElement.getAttribute("height");
      if (width && height) {
        svgWidth = parseFloat(width.replace(/[^\d.]/g, "")) || 800;
        svgHeight = parseFloat(height.replace(/[^\d.]/g, "")) || 600;
      }
    }

    // Calculate total dimensions with margins
    const totalWidth = svgWidth + margins.left + margins.right;
    const totalHeight = svgHeight + margins.top + margins.bottom;

    // Create a new SVG with background and margins applied
    const wrappedSvg = `
      <svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${
          selectedTheme.variables["--background-color"]
        }"/>
        <g transform="translate(${margins.left}, ${margins.top})">
          ${styledSvg.replace(/<svg[^>]*>/, "").replace(/<\/svg>$/, "")}
        </g>
      </svg>
    `;

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

  // Update original iframe content
  React.useEffect(() => {
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

  const styledSvgContent = svgContent
    ? applySvgStyles(svgContent, selectedTheme)
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
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
                onClick={downloadStyledSvg}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* File Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload SVG File
              </label>

              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 bg-gray-50/50"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    SVG files up to 5MB
                  </p>
                </div>
              </div>

              {fileName && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FileImage className="h-4 w-4" />
                  <span className="truncate">{fileName}</span>
                </div>
              )}
            </div>

            {/* Theme Selector */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Theme
              </label>

              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={`relative p-3 rounded-lg border-2 transition-all duration-200 text-left hover:border-blue-400 hover:shadow-md ${
                      selectedTheme.id === theme.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="font-medium text-xs text-gray-900 mb-2">
                      {theme.name}
                    </div>
                    <div className="flex space-x-1">
                      {Object.entries(theme.variables).map(([key, color]) => (
                        <div
                          key={key}
                          className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Margin Controls */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                <Maximize2 className="h-4 w-4 inline mr-1" />
                Margins (px)
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Top
                  </label>
                  <input
                    type="number"
                    value={margins.top}
                    onChange={(e) =>
                      setMargins((prev) => ({
                        ...prev,
                        top: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Right
                  </label>
                  <input
                    type="number"
                    value={margins.right}
                    onChange={(e) =>
                      setMargins((prev) => ({
                        ...prev,
                        right: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Bottom
                  </label>
                  <input
                    type="number"
                    value={margins.bottom}
                    onChange={(e) =>
                      setMargins((prev) => ({
                        ...prev,
                        bottom: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Left
                  </label>
                  <input
                    type="number"
                    value={margins.left}
                    onChange={(e) =>
                      setMargins((prev) => ({
                        ...prev,
                        left: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="500"
                  />
                </div>
              </div>

              <button
                onClick={() =>
                  setMargins({ top: 20, right: 20, bottom: 20, left: 20 })
                }
                className="w-full px-3 py-2 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Reset to Default
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Preview Section */}
        {svgContent && (
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
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Original
                </h3>
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
                  className="rounded-lg p-4 overflow-auto h-64 sm:h-80 flex items-center justify-center"
                  style={{
                    backgroundColor:
                      selectedTheme.variables["--background-color"],
                  }}
                >
                  <div
                    className="max-w-full max-h-full"
                    dangerouslySetInnerHTML={{ __html: styledSvgContent }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!svgContent && !error && (
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
        )}
      </main>
    </div>
  );
}

export default App;
