"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useFileContext } from "@/context/FileContext";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showAlert, setShowAlert] = useState(false);
    const [allowFilePick, setAllowFilePick] = useState(false);
    const { setFile } = useFileContext();

    const handleFileClick = (event: React.MouseEvent<HTMLInputElement>) => {
      if (!allowFilePick) {
        event.preventDefault();
        setShowAlert(true);
      }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files ? event.target.files[0] : null;
      setFile(selectedFile);
    };

    useEffect(() => {
      if (showAlert && allowFilePick) {
        setShowAlert(false);
      }
    }, [allowFilePick, showAlert]);

    const handleConfirm = () => {
      setAllowFilePick(true);
    };

    return (
      <>
        <input
          type={type}
          accept=".java, text/x-java-source"
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          onClick={handleFileClick}
          onChange={handleFileChange}
          {...props}
        />

        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hello, just a reminder!</AlertDialogTitle>
              <AlertDialogDescription>
                Make sure to pick ONLY files with the .java file extension, or
                bad things are going to happen under the hood! We do NOT want
                that to happen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowAlert(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                I understand
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
);

Input.displayName = "Input";

export { Input };
