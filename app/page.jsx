import { useAuth } from "@/authMiddleware";
import { Title, TitleContent, TitleOption } from "@/components/Title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cookies } from "next/headers";

const Home = async () => {
  const user = cookies().get("user");
  await useAuth();

  return (
    <div className="">
      <Title className={"col-span-12"}>
        <TitleContent>Dashboard</TitleContent>
      </Title>
      <div className="col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Elo tytuł</CardTitle>
          </CardHeader>
          <CardContent>elówina</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
