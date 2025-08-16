import type { Theme, Margins } from "../types";

export const applySvgStyles = (
  svgString: string,
  theme: Theme,
  margins: Margins
): string => {
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

export const getSvgDimensions = (
  svgString: string
): { width: number; height: number } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = doc.querySelector("svg");

  if (!svgElement) {
    return { width: 800, height: 600 };
  }

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

  return { width: svgWidth, height: svgHeight };
};

export const createWrappedSvg = (
  styledSvg: string,
  theme: Theme,
  margins: Margins,
  dimensions: { width: number; height: number }
): string => {
  const totalWidth = dimensions.width + margins.left + margins.right;
  const totalHeight = dimensions.height + margins.top + margins.bottom;

  return `
    <svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${
        theme.variables["--background-color"]
      }"/>
      <g transform="translate(${margins.left}, ${margins.top})">
        ${styledSvg.replace(/<svg[^>]*>/, "").replace(/<\/svg>$/, "")}
      </g>
    </svg>
  `;
};
