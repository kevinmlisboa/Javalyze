import HomeCard from "@/components/dashboard/HomeCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Home = () => {
  return (
    <div className="sm:p-6 md:p-8 lg:p-12">
      <Card>
        <CardHeader>
          <CardTitle className="sm:text-xl md:text-2xl lg:text-4xl ">
            Javalyze
          </CardTitle>
          <CardDescription className="sm:text-sm md:text-md lg:text-lg">
            A mini front-end based java compiler that runs in remotely with your
            browser, across an array of devices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HomeCard />
        </CardContent>
        <CardFooter>
          <p>Powered by Next JS and shadcn/ui</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Home;
