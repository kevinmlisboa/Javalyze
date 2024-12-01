import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFileContext } from "@/context/FileContext";
import { useEffect, useRef } from "react";

const FilePicker = () => {
  const { file, setFile, clearFile } = useFileContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  useEffect(() => {
    if (!file && fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  }, [file]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Picker</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="java-file">Select a .java file</Label>
        <Input
          id="java-file"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".java"
        />
      </CardContent>
    </Card>
  );
};

export default FilePicker;
