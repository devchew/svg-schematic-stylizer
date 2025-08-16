import type { Theme, Margins } from "../types";

export interface CanvasRenderOptions {
  width: number;
  height: number;
  scale?: number;
  backgroundColor?: string;
}

export const renderSvgToCanvas = async (
  svgContent: string,
  margins: Margins,
  options: CanvasRenderOptions,
  theme?: Theme
): Promise<HTMLCanvasElement> => {
  const { width, height, scale = 1, backgroundColor } = options;

  // Create canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Set canvas dimensions
  canvas.width = width * scale;
  canvas.height = height * scale;
  ctx.scale(scale, scale);

  // Fill background
  const bgColor =
    backgroundColor || theme?.variables["--background-color"] || "transparent";
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Create styled SVG
  const styledSvg = createStyledSvgForCanvas(
    svgContent,
    {
      width: width - margins.left - margins.right,
      height: height - margins.top - margins.bottom,
    },
    theme
  );

  // Create image from SVG
  const img = new Image();
  const svgBlob = new Blob([styledSvg], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Draw SVG with margins
      ctx.drawImage(
        img,
        margins.left,
        margins.top,
        width - margins.left - margins.right,
        height - margins.top - margins.bottom
      );
      URL.revokeObjectURL(url);
      resolve(canvas);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG"));
    };

    img.src = url;
  });
};

export const createStyledSvgForCanvas = (
  svgContent: string,
  dimensions: { width: number; height: number },
  theme?: Theme
): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, "image/svg+xml");
  const svgElement = doc.querySelector("svg");

  if (!svgElement) {
    return svgContent;
  }

  // Set SVG dimensions
  svgElement.setAttribute("width", dimensions.width.toString());
  svgElement.setAttribute("height", dimensions.height.toString());

  // Directly modify SVG elements instead of relying on CSS
  if (theme) {
    // Apply theme styles to SVG elements
    applyThemeToElements(doc, theme);
  }

  return new XMLSerializer().serializeToString(doc);
};

const applyThemeToElements = (doc: Document, theme: Theme): void => {
  // Apply text styling
  const textElements = doc.querySelectorAll("text");
  textElements.forEach((element) => {
    element.setAttribute("fill", theme.variables["--text-color"]);
    // Keep filter simple for better canvas compatibility
    element.style.filter = `drop-shadow(1px 0px 8px ${theme.variables["--text-color"]})`;
  });

  // Apply background color overrides (white fills become background color)
  const whiteFillSelectors = [
    '[fill="#FFFFFF"]', '[fill="white"]', '[fill="#ffffff"]', '[fill="White"]',
    '[fill="#FFF"]', '[fill="#fff"]'
  ];
  whiteFillSelectors.forEach(selector => {
    const elements = doc.querySelectorAll(selector);
    elements.forEach((element) => {
      element.setAttribute("fill", theme.variables["--background-color"]);
    });
  });

  // Apply part color overrides (black and specific red strokes)
  const partStrokeSelectors = [
    '[stroke="#000000"]', '[stroke="black"]', '[stroke="#000"]',
    '[stroke="#A54B4B"]', '[stroke="#a54b4b"]',
    '[stroke="#FF0000"]', '[stroke="red"]', '[stroke="#ff0000"]',
    '[stroke="#880000"]', '[stroke="#8D2323"]', '[stroke="#8d2323"]'
  ];
  
  partStrokeSelectors.forEach((selector) => {
    const elements = doc.querySelectorAll(selector);
    elements.forEach((element) => {
      element.setAttribute("stroke", theme.variables["--part-color"]);
    });
  });

  // Apply wire color overrides (elements with c_etype="wire")
  const wireElements = doc.querySelectorAll('[c_etype="wire"]');
  wireElements.forEach((element) => {
    element.setAttribute("stroke", theme.variables["--wire-color"]);
  });

  // Apply junction color overrides (circles in part_junction)
  const junctionElements = doc.querySelectorAll('[c_partid="part_junction"] circle');
  junctionElements.forEach((element) => {
    element.setAttribute("fill", theme.variables["--wire-color"]);
  });

  // Handle any remaining black fills that should be part color
  const blackFillSelectors = [
    '[fill="#000000"]', '[fill="black"]', '[fill="#000"]'
  ];
  blackFillSelectors.forEach(selector => {
    const elements = doc.querySelectorAll(selector);
    elements.forEach((element) => {
      // Don't override text elements as they're already handled
      if (element.tagName.toLowerCase() !== "text") {
        element.setAttribute("fill", theme.variables["--part-color"]);
      }
    });
  });

  // More intelligent wire/part detection
  const allElements = doc.querySelectorAll('*');
  allElements.forEach((element) => {
    const tagName = element.tagName.toLowerCase();
    const cType = element.getAttribute("c_etype");
    const cPartId = element.getAttribute("c_partid");
    const stroke = element.getAttribute("stroke");
    const fill = element.getAttribute("fill");
    
    // Handle wire elements specifically
    if (cType === "wire" && stroke) {
      element.setAttribute("stroke", theme.variables["--wire-color"]);
    }
    
    // Handle part elements
    if (cPartId && cPartId !== "part_junction") {
      if (stroke && (stroke.includes("#000") || stroke === "black")) {
        element.setAttribute("stroke", theme.variables["--part-color"]);
      }
      if (fill && (fill.includes("#000") || fill === "black") && tagName !== "text") {
        element.setAttribute("fill", theme.variables["--part-color"]);
      }
    }
    
    // Handle paths and lines that are likely wires (thin, black, no specific part ID)
    if ((tagName === "path" || tagName === "line") && !cPartId && stroke) {
      const strokeWidth = element.getAttribute("stroke-width");
      const isBlackStroke = stroke === "#000000" || stroke === "black" || stroke === "#000";
      const isThinStroke = !strokeWidth || parseFloat(strokeWidth) <= 2;
      
      if (isBlackStroke && isThinStroke) {
        element.setAttribute("stroke", theme.variables["--wire-color"]);
      }
    }
  });
};

export const getSvgNaturalDimensions = (svgContent: string): { width: number; height: number } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, "image/svg+xml");
  const svgElement = doc.querySelector("svg");

  if (!svgElement) {
    return { width: 800, height: 600 };
  }

  let width = 800;
  let height = 600;

  // Try viewBox first
  if (svgElement.viewBox && svgElement.viewBox.baseVal) {
    width = svgElement.viewBox.baseVal.width;
    height = svgElement.viewBox.baseVal.height;
  } else {
    // Fallback to width/height attributes
    const widthAttr = svgElement.getAttribute("width");
    const heightAttr = svgElement.getAttribute("height");
    
    if (widthAttr && heightAttr) {
      width = parseFloat(widthAttr.replace(/[^\d.]/g, "")) || 800;
      height = parseFloat(heightAttr.replace(/[^\d.]/g, "")) || 600;
    }
  }

  return { width, height };
};
