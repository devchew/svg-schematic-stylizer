export interface Theme {
  id: string;
  name: string;
  variables: {
    "--text-color": string;
    "--wire-color": string;
    "--part-color": string;
    "--background-color": string;
  };
}

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface AppState {
  svgContent: string;
  selectedTheme: Theme;
  fileName: string;
  error: string;
  isDragOver: boolean;
  margins: Margins;
}
