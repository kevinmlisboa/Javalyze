import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FilePicker = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>File picker</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="java-file">.java file</Label>
          <Input id="java-file" type="file" />
        </CardContent>
      </Card>
    </>
  );
};

export default FilePicker;
