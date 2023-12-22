"use client";
import React, { useEffect } from "react";
import { generateRandomString } from "@/utils/utils";
import bcrypt from "bcryptjs";
import toast from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";
import { register } from "../_actions";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const saltRounds = 10;

const SetupBox = () => {
  const [isPasswordLongEnough, setIsPasswordLongEnough] = React.useState(false);
  const [isPasswordSpecial, setIsPasswordSpecial] = React.useState(false);
  const [password, setPassword] = React.useState({
    value: "",
    repeat: "",
  });
  const [errors, setErrors] = React.useState({
    username: false,
    password: false,
    repeat: false,
  });
  const router = useRouter();

  const formValidation = (e) => {
    let errors = {
      username: false,
      password: false,
      repeat: false,
    }
    if (!isPasswordLongEnough || !isPasswordSpecial){
      errors.password = true;
    }
    if (password.value !== password.repeat) {
      errors.repeat = true;
    }
    if (e.target.username.value.length < 3) {
      errors.username = true;
    }
    return errors;
  };

  useEffect(() => {
    console.log(errors)
  }, [errors])

  async function handleSetupSubmit(e) {
    e.preventDefault();
    const errors = formValidation(e);
    setErrors(errors);
    if (Object.values(errors).some((error) => error === true)) {
      return;
    }

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
    setPassword({ ...password, value: password });
    if (password.length >= 8) {
      setIsPasswordLongEnough(true);
    } else {
      setIsPasswordLongEnough(false);
    }

    if (password.match(/[!@#$%^&*(),.?":{}|<>]/)) {
      setIsPasswordSpecial(true);
    } else {
      setIsPasswordSpecial(false);
    }
  }

  return (
    <form className="w-[400px] max-w-full" onSubmit={handleSetupSubmit}>
      <CardHeader>
        <CardTitle>Setup</CardTitle>
        <CardDescription>
          We will setup your dashboard in a few steps
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Label htmlFor="username">What should we call you?</Label>
        <Input
          type="text"
          name="name"
          id="name"
          placeholder="Enter your name"
        />
        <Label htmlFor="username">Select a username (your login)</Label>
        <Input
          type="text"
          name="username"
          id="username"
          placeholder="Enter your username"
          className={errors.username ? "border-red-500" : ""}
        />
        <Label htmlFor="password">Choose a nice password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          onChange={handlePasswordChange}
          className={errors.password ? "border-red-500" : ""}
        />
        <Label htmlFor="repeatpassword">Repeat the password</Label>
        <Input
          type="password"
          name="repeatpassword"
          id="repeatpassword"
          placeholder="Password once more"
          className={errors.repeat ? "border-red-500" : ""}
          onChange={(e) => setPassword({ ...password, repeat: e.target.value })}
        />
        <p className="text-sm text-gray-300">Your password should:</p>
        <ul className="list-none list-inside">
          <li className="relative py-1 text-xs flex items-center gap-1">
            <span
              className={`w-4 h-4 flex border border-gray-300 rounded-full transition-all duration-500 ${
                isPasswordLongEnough ? "bg-green-500 border-none" : "bg-transparent"
              }`}
            ></span>
            Be at least 8 characters long
          </li>
          <li className="relative py-1 text-xs flex items-center gap-1">
            <span
              className={`w-4 h-4 flex border border-gray-300 rounded-full transition-all duration-500 ${
                isPasswordSpecial ? "bg-green-500 border-none" : "bg-transparent"
              }`}
            ></span>
            Contain at least one special character
          </li>
          <li className="relative py-1 text-xs flex items-center gap-1">
            <span
              className={`w-4 h-4 flex border border-gray-300 rounded-full transition-all duration-500 ${
                (password.value === password.repeat && password.value != "") ? "bg-green-500 border-none" : "bg-transparent"
              }`}
            ></span>
            Match the repeated password
          </li>
        </ul>
        <Button type="submit">Set up</Button>
      </CardContent>
    </form>
  );
};

export default SetupBox;
