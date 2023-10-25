"use client";
import { useState, useEffect } from "react";
import Card from "@/components/Cards/Card_OLD";
import LoginBox from "./LoginBox";
import SetupBox from "./SetupBox";
import RecoveryBox from "./RecoveryBox";
const Body = ({ userRegistered_res, error }) => {
  const [step, setStep] = useState(1); // 1 = login, 2 = setup, 3 = recovery display
  const [userRegistered, setUserRegistered] = useState(null);
  const [recovery, setRecovery] = useState(null);

  useEffect(() => {
    console.log(userRegistered_res);
    setUserRegistered(userRegistered_res);
    userRegistered_res ? setStep(1) : setStep(2);
  }, [userRegistered_res]);

  return (
    userRegistered && (
      <div className="w-full h-full relative flex justify-center items-center">
        <Card cClass={"p-12"}>
          <div className="w-full flex flex-col justify-center items-center relative overflow-y-auto">
            {step === 1 && <LoginBox />}
            {step === 2 && <SetupBox setRecovery={setRecovery} />}
            {step === 3 && <RecoveryBox recovery={recovery} />}
          </div>
        </Card>
      </div>
    )
  );
};

export default Body;
