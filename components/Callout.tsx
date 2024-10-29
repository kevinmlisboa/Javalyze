import { RocketIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Callout = () => {
  return (
    <Alert>
      <RocketIcon className="h-4 w-4" />
      <AlertTitle>Test passed!</AlertTitle>
      <AlertDescription>
        Analysis passed, you can now move to the next phase.
      </AlertDescription>
    </Alert>
  );
};

export default Callout;
