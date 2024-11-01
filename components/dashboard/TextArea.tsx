import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFileContext } from "@/context/FileContext";
import { useEffect, useState } from "react";

const TextArea = () => {
  const { file } = useFileContext();
  const [fileContent, setFileContent] = useState<string | null>(null);

  const readFile = (file: File | null) => {
    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = (ev: ProgressEvent<FileReader>) => {
        if (ev.target) {
          setFileContent(ev.target.result!.toString());
        }
      };

      fileReader.readAsText(file);
    } else {
      setFileContent("");
      console.log("Please select a java file");
    }
  };
  useEffect(() => {
    readFile(file);
  }, [file]);

  console.log(fileContent);
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Source Code</CardTitle>
      </CardHeader>
      <CardContent className="h-[70vh] sm:h-[50vh] md:h-[40vh] lg:h-[60vh]">
        <ScrollArea className="h-full w-full rounded-md border overflow-y-auto">
          <pre>{fileContent}</pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TextArea;
