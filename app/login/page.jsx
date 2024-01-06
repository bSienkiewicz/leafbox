import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Body from "./Body";
import LoginBox from "./LoginBox";
import SetupBox from "./SetupBox";
import RecoveryBox from "./RecoveryBox";
import { Card } from "@/components/ui/card";
import Error from "@/components/Error";
import { checkIfUserRegistered } from "../_actions";

const page = async () => {
  let step = 1;
  const token = cookies().get("jwt");
  let error = false;
  let userRegistered = null;
  if (token) redirect("/");

  await checkIfUserRegistered()
    .then((res) => {
      console.log(res)
      userRegistered = res;
      step = userRegistered ? 1 : 2;
    })
    .catch((err) => {
      error = err;
      console.log("ERROR LOGIN")
    });

  const stepSwitch = (step) => {
    switch (step) {
      case 1:
        return <LoginBox />;
      case 2:
        return <SetupBox/>;
      default:
        return <LoginBox />;
    }
  };

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Error
          err={
            error
          }
          action={"refresh"}
        />
      </div>
    );
  }

  if (userRegistered !== null) {
    return (
      <div className="w-screen h-screen absolute top-0 left-0 flex justify-center items-center">
        <Card className={"p-5"}>
          <div className="w-full flex flex-col justify-center items-center relative overflow-y-auto">
            {stepSwitch(step)}
          </div>
        </Card>
      </div>
    );
  }
};

export default page;
