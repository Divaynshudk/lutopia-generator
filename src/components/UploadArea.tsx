
import { cn } from "@/lib/utils";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./Button";
import { Upload, Image } from "lucide-react";

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
        "border-2 border-dashed outline-none",
        "hover:border-accent/70 hover:bg-accent/5",
        {
          "border-accent bg-accent/5 scale-[1.02]": isDragging,
          "border-muted-foreground/20 bg-secondary/50": !isDragging,
        },
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 animate-fade-in text-center">
        <div className="rounded-full bg-secondary p-4 animate-fade-in">
          <Image
            className="h-8 w-8 text-primary transition-transform"
            style={{ 
              transform: isDragging ? 'scale(1.2) translateY(-4px)' : 'scale(1) translateY(0)'
            }}
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-medium animate-slide-down">
            {isDragging ? "Drop your image here" : "Upload your image"}
          </span>
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
          className="mt-2 animate-slide-up flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Select Image
        </Button>
      </div>
    </div>
  );
};
