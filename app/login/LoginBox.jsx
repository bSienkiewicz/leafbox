"use client"

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/leafbox.svg";
import { useTokenStore } from "@/store/zustand";
import { userLogin } from "@/lib/db";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const LoginBox = ({login}) => {
  const router = useRouter();
  const setToken = useTokenStore((state) => state.setToken);

  async function handleLoginSubmit(e) {
    e.preventDefault();

    const data = {
      username: e.target.username.value,
      password: e.target.password.value,
    };
    await login(data).then(res => {
      if (res.token) {
        console.log('LOGGING IN...')
        setToken(res.token);
        Cookies.set('jwt', res.token, { expires: 7 });
        Cookies.set('user', res.user, { expires: 7 });
        toast.success('Logged in successfully!');
      } else {
        return Promise.reject("Incorrect username or password");
      }
    }).then(() => {
      router.push('/');
    }).catch(err => {
      toast.error(err);
    });

  }

  return (
    <form className="w-[300px] max-w-full" onSubmit={handleLoginSubmit}>
      <Image
        src={logo}
        alt="Leafbox logo"
        width={"auto"}
        height={50}
        className="mx-auto mb-6"
        priority
      />
      <Label htmlFor="username" className="text-sm font-medium">
        Username
      </Label>
      <Input
        type="text"
        name="username"
        id="username"
        placeholder="Enter your username"
        className="w-full rounded py-2 px-4 mb-3 text-sm bg-gray-700/20"
      />
      <Label htmlFor="password" className="text-sm font-medium">
        Password
      </Label>
      <Input
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        className="w-full rounded py-2 px-4 mb-3 text-sm bg-gray-700/20"
      />
      <div className="flex items-center gap-1">
        <Checkbox name="remember" id="remember" />
        <Label htmlFor="remember" className="text-sm font-medium">
          Don't log me out
        </Label>
      </div>
      <Button
        type="submit"
        className="w-full py-4 text-sm mt-4"
      >
        Login
      </Button>
    </form>
  );
};

export default LoginBox;
