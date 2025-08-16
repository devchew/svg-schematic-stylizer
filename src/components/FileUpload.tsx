import React, { useRef } from "react";
import { Upload, FileImage } from "lucide-react";

interface FileUploadProps {
  fileName: string;
  isDragOver: boolean;
  onFileUpload: (file: File) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  fileName,
  isDragOver,
  onFileUpload,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  return (
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
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg,image/svg+xml"
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload SVG file"
        />

        <div className="text-center">
          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            <span className="font-medium text-blue-600">Click to upload</span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">SVG files up to 5MB</p>
        </div>
      </div>

      {fileName && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FileImage className="h-4 w-4" />
          <span className="truncate">{fileName}</span>
        </div>
      )}
    </div>
  );
};
