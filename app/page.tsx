"use client";

import FilePicker from "@/components/dashboard/FilePicker";
import OperationsArea from "@/components/dashboard/OperationsArea";
import TextArea from "@/components/dashboard/TextArea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFileContext } from "@/context/FileContext";

const Home = () => {
  const { file } = useFileContext();
  console.log(file);
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12 h-screen flex flex-col">
      <Card className="flex-1 h-full flex flex-col mb-4">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl lg:text-4xl">
            Javalyze
          </CardTitle>
          <CardDescription className="text-sm md:text-md lg:text-lg">
            A mini front-end based Java compiler that runs remotely within your
            browser, across an array of devices.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-grow flex">
          <div className="flex-1 pr-4">
            <TextArea />
          </div>

          <div className="flex flex-col gap-4 w-[30%]">
            <FilePicker />
            <OperationsArea />
          </div>
        </CardContent>

        <CardFooter>
          <p>Powered by Next JS and shadcn/ui</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Home;
