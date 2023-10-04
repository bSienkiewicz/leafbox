"use client";
import React from "react";
import leafbg from "../../public/leafbg.jpg";
import Image from "next/image";
import bcrypt from "bcryptjs";
import { login, register } from "@/lib/db";
import { generateRandomString } from "@/utils/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const saltRounds = 10;

const toastOptions = {
};

const page = () => {
  const router = useRouter();
  const [step, setStep] = React.useState(1); // 1 = login, 2 = setup, 3 = recovery display
  const [isPasswordLongEnough, setIsPasswordLongEnough] = React.useState(false);
  const [isPasswordNumber, setIsPasswordNumber] = React.useState(false);
  const [isPasswordSpecial, setIsPasswordSpecial] = React.useState(false);
  const [recovery, setRecovery] = React.useState(null);

  function handleLoginSubmit(e) {
    e.preventDefault();
    
    let data = {
      username: e.target.username.value,
      password: e.target.password.value,
    }

    try{
      login(data)
      .then((res) => {
        if (res.status === 200) {
          if(window !== undefined){
            localStorage.setItem("jwt", res.data.token);
            localStorage.setItem("user", res.data.user);
          }
          router.push("/");
        } else if (res.status === 401) {
          toast.error("Invalid username or password", toastOptions);
        } else {
          console.error(res);
          toast.error("Error logging in", toastOptions);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error logging in", toastOptions);
        throw new Error(err);
      });
    } catch(err){
      console.error(err);
      toast.error("Error logging in", toastOptions);
    }
  }

  function handleSetupSubmit(e) {
    e.preventDefault();
    if (!isPasswordLongEnough || !isPasswordNumber || !isPasswordSpecial)
      return;

    const hashedPassword = bcrypt.hashSync(e.target.password.value, saltRounds);
    const recovery =
      "leafbox-" +
      generateRandomString(4) +
      "-" +
      generateRandomString(4) +
      "-" +
      generateRandomString(4);
    setRecovery(recovery);

    const hashedRecovery = bcrypt.hashSync(recovery, saltRounds);
    let data = {
      name: e.target.name.value,
      username: e.target.username.value,
      password: hashedPassword,
      recovery: hashedRecovery,
    };

    register(data)
      .then((res) => {
        if (res.status === 200) {
          setStep(3);
        } else if (res.status === 409) {
          toast.error("Username already taken", toastOptions);
        } else {
          console.error(res);
          toast.error("Error registering", toastOptions);
        }
      })
      .catch((err) => {
        console.error(err);
        throw new Error(err);
      });
  }

  function handlePasswordChange(e) {
    const password = e.target.value;
    if (password.length >= 8) {
      setIsPasswordLongEnough(true);
    } else {
      setIsPasswordLongEnough(false);
    }

    if (password.match(/[0-9]/)) {
      setIsPasswordNumber(true);
    } else {
      setIsPasswordNumber(false);
    }

    if (password.match(/[!@#$%^&*(),.?":{}|<>]/)) {
      setIsPasswordSpecial(true);
    } else {
      setIsPasswordSpecial(false);
    }
  }

  return (
    <div className="w-full h-full relative box-border">
      <Image
        src={leafbg}
        className="absolute top-0 left-0 w-full h-full object-cover"
        priority
        alt="Leafbox background"
      />
      <div className="absolute w-full h-full top-0 left-0 bg-black/50 z-10"></div>
      <div className="grid grid-rows-1 grid-cols-2 h-full w-full relative">
        <div className=""></div>
        <div className="w-full h-full z-10 p-3 ps-0">
          <div className="w-full h-full bg-white rounded-lg flex flex-col justify-center items-center relative overflow-y-auto">
            <div className="absolute top-4 left-0 flex justify-center w-full gap-3">
              <button
                onClick={() => setStep(1)}
                className={`py-2 px-3 text-sm border rounded-full ${
                  step === 1 ? "bg-black text-white" : "bg-white text-black"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setStep(2)}
                className={`py-2 px-3 text-sm border rounded-full ${
                  step === 2 ? "bg-black text-white" : "bg-white text-black"
                }`}
              >
                Setup
              </button>
              <button
                onClick={() => setStep(3)}
                className={`py-2 px-3 text-sm border rounded-full ${
                  step === 3 ? "bg-black text-white" : "bg-white text-black"
                }`}
              >
                Recovery
              </button>
            </div>
            {step === 1 && (
              <form
                className="w-[300px] max-w-full"
                onSubmit={handleLoginSubmit}
              >
                <h1 className="text-2xl font-medium">Login</h1>
                <p className="text-gray-600 text-sm mb-4">
                  Login to the dashboard
                </p>
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Enter your username"
                  className="w-full border border-gray-300 rounded-full py-2 px-4 mb-3 text-sm"
                />
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-full py-2 px-4 mb-3 text-sm"
                />
                <div className="flex items-center gap-1">
                  <input type="checkbox" name="remember" id="remember" />
                  <label htmlFor="remember" className="text-sm font-medium">
                    Don't log me out
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-900 text-white rounded-full py-4 text-sm mt-4"
                >
                  Login
                </button>
              </form>
            )}
            {step === 2 && (
              <form
                className="w-[300px] max-w-full"
                onSubmit={handleSetupSubmit}
              >
                <h1 className="text-2xl font-medium">Setup</h1>
                <p className="text-gray-600 text-sm mb-4">
                  We will setup your dashboard in a few steps
                </p>
                <label htmlFor="username" className="text-sm font-medium">
                  What is your name?
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded-full py-2 px-4 mb-3 text-sm"
                />
                <label htmlFor="username" className="text-sm font-medium">
                  Select a username (login)
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Enter your username"
                  className="w-full border border-gray-300 rounded-full py-2 px-4 mb-3 text-sm"
                />
                <label htmlFor="password" className="text-sm font-medium">
                  Choose a password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-full py-2 px-4 mb-3 text-sm"
                  onChange={handlePasswordChange}
                />
                <p className="text-sm text-gray-600">Your password should:</p>
                <ul className="list-none list-inside">
                  <li className="relative py-1 text-sm flex items-center gap-1">
                    <span
                      className={`w-4 h-4 flex border border-gray-300 rounded-full transition-all duration-500 ${
                        isPasswordLongEnough ? "bg-green-500" : "bg-white"
                      }`}
                    ></span>
                    Be at least 8 characters long
                  </li>
                  <li className="relative py-1 text-sm flex items-center gap-1">
                    <span
                      className={`w-4 h-4 flex border border-gray-300 rounded-full transition-all duration-500 ${
                        isPasswordNumber ? "bg-green-500" : "bg-white"
                      }`}
                    ></span>
                    Contain at least one number
                  </li>
                  <li className="relative py-1 text-sm flex items-center gap-1">
                    <span
                      className={`w-4 h-4 flex border border-gray-300 rounded-full transition-all duration-500 ${
                        isPasswordSpecial ? "bg-green-500" : "bg-white"
                      }`}
                    ></span>
                    Contain at least one special character
                  </li>
                </ul>
                <button
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-900 text-white rounded-full py-4 text-sm mt-4"
                >
                  Login
                </button>
              </form>
            )}
            {step === 3 && (
              <div className="w-[300px] max-w-full mb-4">
                <h1 className="text-2xl font-medium">Everything is set!</h1>
                <p>
                  Make sure to copy this recovery code and store it in a safe
                  place.
                </p>

                <p className="text-gray-600 text-sm mb-3">
                  {" "}
                  You'll need it to recover your password if you ever forget it.
                </p>
                <div className="relative">
                  <input
                    className="w-full border border-gray-300 rounded-full py-2 px-4 mb-3 text-sm"
                    readOnly
                    value={recovery}
                  />
                  <button
                    className="absolute right-0 top-0 bottom-0 px-4"
                    onClick={() => navigator.clipboard.writeText(recovery)}
                  >
                    <span className="sr-only">Copy recovery code</span>
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14 2H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2zM6 4h8v10H6V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-900 text-white rounded-full py-4 text-sm mt-4"
                  onClick={() => setStep(1)}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
