"use client";
import React, { useEffect } from "react";
import { checkIfUserRegistered, login, register } from "@/lib/db";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import Card from "@/components/Cards/Card";
import LoginBox from "./LoginBox";
import SetupBox from "./SetupBox";
import RecoveryBox from "./RecoveryBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const saltRounds = 10;

const page = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = React.useState(1); // 1 = login, 2 = setup, 3 = recovery display
  const [userRegistered, setUserRegistered] = React.useState(null);
  const [recovery, setRecovery] = React.useState(null);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    checkIfUserRegistered()
      .then((res) => {
        res.data ? setStep(1) : setStep(2);
        setUserRegistered(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      });
  }, []);

  return (
    <>
      {error && (
        <div className="w-full h-full flex justify-center items-center">
          <Error />
        </div>
      )}
      {userRegistered !== null && (
        <div className="w-full h-full relative flex justify-center items-center">
          <Card cClass={"p-12"}>
            <div className="w-full flex flex-col justify-center items-center relative overflow-y-auto">
              <div className="absolute top-0 left-0 flex justify-end w-full gap-3 hidden">
                <button
                  onClick={() => setStep(1)}
                  className={` text-sm border rounded-full ${
                    step === 1 ? "bg-black text-white" : "bg-white text-black"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setStep(2)}
                  className={`text-sm border rounded-full ${
                    step === 2 ? "bg-black text-white" : "bg-white text-black"
                  }`}
                >
                  Setup
                </button>
                <button
                  onClick={() => setStep(3)}
                  className={`text-sm border rounded-full ${
                    step === 3 ? "bg-black text-white" : "bg-white text-black"
                  }`}
                >
                  Recovery
                </button>
              </div>
              {step === 1 && <LoginBox />}
              {step === 2 && <SetupBox setRecovery={setRecovery} />}
              {step === 3 && <RecoveryBox recovery={recovery} />}
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default page;
