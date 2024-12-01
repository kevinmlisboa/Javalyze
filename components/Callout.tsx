import { RocketIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type CalloutProps = {
  message: string;
  status: boolean;
};

const Callout = ({ message, status }: CalloutProps) => {
  return (
    <Alert className={status ? "bg-stone-100" : "bg-stone-300"}>
      <RocketIcon className="h-4 w-4" />
      <AlertTitle>{status ? "Test passed!" : "Test failed!"}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default Callout;
