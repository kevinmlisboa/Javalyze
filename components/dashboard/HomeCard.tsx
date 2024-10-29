import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const HomeCard = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>File picker</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="java-file">.java file</Label>
          <Input id="java-file" type="file" />
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeCard;
