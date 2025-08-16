import React from "react";
import type { Theme } from "../types";

interface ThemeSelectorProps {
  themes: Theme[];
  selectedTheme: Theme;
  onThemeSelect: (theme: Theme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  selectedTheme,
  onThemeSelect,
}) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Select Theme
      </label>

      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeSelect(theme)}
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
                  className="w-3 h-3 rounded-full border border-gray-300 shadow-sm bg-current"
                  style={{ backgroundColor: color }}
                  title={key}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
