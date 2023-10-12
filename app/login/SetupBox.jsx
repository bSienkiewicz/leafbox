"use client"
import React from "react";
import { generateRandomString } from "@/utils/utils";
import bcrypt from "bcryptjs";
import toast from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";

const saltRounds = 10;

const SetupBox = ({register}) => {
  const [isPasswordLongEnough, setIsPasswordLongEnough] = React.useState(false);
  const [isPasswordNumber, setIsPasswordNumber] = React.useState(false);
  const [isPasswordSpecial, setIsPasswordSpecial] = React.useState(false);
  const router = useRouter();

  async function handleSetupSubmit(e) {
    e.preventDefault();
    if (!isPasswordLongEnough || !isPasswordNumber || !isPasswordSpecial)
      return;

    const hashedPassword = bcrypt.hashSync(e.target.password.value, saltRounds);

    let data = {
      name: e.target.name.value,
      username: e.target.username.value,
      password: hashedPassword,
    };

    await register(data)
      .then((res) => {
        if (res.code === 200) {
          toast.success("Registered successfully");
          toast.success("Redirecting to login page");
          // refresh window
          window.location.reload();
        } else if (res.code === 409) {
          toast.error("Username already taken");
        } else {
          console.error(res);
          toast.error(res.message);
        }
      })
      .catch((err) => {
        toast.error("Unknown error");
        toast.error("Error registering");
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
    <form className="w-[400px] max-w-full" onSubmit={handleSetupSubmit}>
      <h1 className="text-2xl font-medium">Setup</h1>
      <p className="text-gray-300 text-sm mb-4">
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
        className="w-full rounded py-2 px-4 mb-3 text-sm bg-gray-700/20"
      />
      <label htmlFor="username" className="text-sm font-medium">
        Select a username (login)
      </label>
      <input
        type="text"
        name="username"
        id="username"
        placeholder="Enter your username"
        className="w-full rounded py-2 px-4 mb-3 text-sm bg-gray-700/20"
      />
      <label htmlFor="password" className="text-sm font-medium">
        Choose a password
      </label>
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        className="w-full rounded py-2 px-4 mb-3 text-sm bg-gray-700/20"
        onChange={handlePasswordChange}
      />
      <p className="text-sm text-gray-300">Your password should:</p>
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
  );
};

export default SetupBox;
