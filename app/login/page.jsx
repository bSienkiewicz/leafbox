import { checkIfUserRegistered, userLogin } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Body from "./Body";
import LoginBox from "./LoginBox";
import SetupBox from "./SetupBox";
import RecoveryBox from "./RecoveryBox";
import { Card } from "@/components/ui/card";

const page = async () => {
  const login = async (data) => {
    "use server";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_ROUTE}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const json = await res.json();
    return json;
  }

  const register = async(data) => {
    "use server";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_ROUTE}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const json = await res.json();
    return json;
  }

  let step = 1;
  const token = cookies().get("jwt");
  let userRegistered = null;
  if (token) redirect("/");

  await checkIfUserRegistered()
    .then((res) => {
      userRegistered = res.data;
      step = userRegistered ? 1 : 2;
    })
    .catch((err) => {
      console.error(err);
    });

  const stepSwitch = (step) => {
    switch (step) {
      case 1:
        return <LoginBox login={login} />;
      case 2:
        return <SetupBox register={register} />;
      default:
        return <LoginBox login={login} />;
    }
  };

  return (
    <div className="w-screen h-screen absolute top-0 left-0 flex justify-center items-center">
      <Card className={"p-12"}>
        <div className="w-full flex flex-col justify-center items-center relative overflow-y-auto">
          {stepSwitch(step)}
        </div>
      </Card>
    </div>
  );
};

export default page;
