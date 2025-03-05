
import { cn } from "@/lib/utils";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./Button";

interface UploadAreaProps {
  onImageUpload: (file: File) => void;
  className?: string;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onImageUpload, className }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageUpload(acceptedFiles[0]);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center w-full rounded-xl p-8 transition-all",
        "bg-secondary/50 border-2 border-dashed outline-none",
        "backdrop-blur-xs",
        {
          "border-accent bg-accent/5": isDragging,
          "border-muted-foreground/20": !isDragging,
        },
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="rounded-full bg-secondary p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-lg font-medium animate-slide-down">Drop your image here</span>
          <span className="text-sm text-muted-foreground animate-slide-down">
            or click the button below to browse
          </span>
        </div>
        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          className="mt-2 animate-slide-up"
        >
          Select Image
        </Button>
      </div>
    </div>
  );
};
