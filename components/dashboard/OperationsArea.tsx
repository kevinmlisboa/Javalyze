// OperationsArea.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import Callout from "../Callout";

const OperationsArea = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Operations Area</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col flex-grow justify-between space-y-4">
        <div className="flex flex-col flex-grow space-y-4">
          <Button className="w-full flex-grow">Lexical</Button>
          <Button className="w-full flex-grow">Syntactical</Button>
          <Button className="w-full flex-grow">Semantical</Button>
          <Button variant="destructive" className="w-full flex-grow">
            Clear
          </Button>
        </div>

        <div className="mt-4">
          <Callout />
        </div>
      </CardContent>
    </Card>
  );
};

export default OperationsArea;
