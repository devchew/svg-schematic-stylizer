import React from "react";
import { Maximize2 } from "lucide-react";
import type { Margins } from "../types";

interface MarginControlsProps {
  margins: Margins;
  onMarginsChange: (margins: Margins) => void;
}

export const MarginControls: React.FC<MarginControlsProps> = ({
  margins,
  onMarginsChange,
}) => {
  const handleMarginChange = (side: keyof Margins, value: number) => {
    onMarginsChange({
      ...margins,
      [side]: value,
    });
  };

  const resetToDefault = () => {
    onMarginsChange({ top: 20, right: 20, bottom: 20, left: 20 });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        <Maximize2 className="h-4 w-4 inline mr-1" />
        Margins (px)
      </label>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Top</label>
          <input
            type="number"
            value={margins.top}
            onChange={(e) =>
              handleMarginChange("top", parseInt(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            max="500"
            aria-label="Top margin"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Right</label>
          <input
            type="number"
            value={margins.right}
            onChange={(e) =>
              handleMarginChange("right", parseInt(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            max="500"
            aria-label="Right margin"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Bottom</label>
          <input
            type="number"
            value={margins.bottom}
            onChange={(e) =>
              handleMarginChange("bottom", parseInt(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            max="500"
            aria-label="Bottom margin"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Left</label>
          <input
            type="number"
            value={margins.left}
            onChange={(e) =>
              handleMarginChange("left", parseInt(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            max="500"
            aria-label="Left margin"
          />
        </div>
      </div>

      <button
        onClick={resetToDefault}
        className="w-full px-3 py-2 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
      >
        Reset to Default
      </button>
    </div>
  );
};
