import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <p className="text-sm text-red-700">{error}</p>
      </div>
    </div>
  );
};
