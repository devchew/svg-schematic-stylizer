export const validateSvgFile = (file: File): string | null => {
  if (!file.type.includes("svg") && !file.name.endsWith(".svg")) {
    return "Please upload a valid SVG file.";
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB limit
    return "File size must be less than 5MB.";
  }

  return null;
};

export const validateSvgContent = (content: string): string | null => {
  if (!content.includes("<svg")) {
    return "Invalid SVG file format.";
  }

  return null;
};
