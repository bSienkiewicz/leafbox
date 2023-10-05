import { login } from "@/lib/db";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/leafbox.svg"

const LoginBox = () => {
  const router = useRouter();
  function handleLoginSubmit(e) {
    e.preventDefault();

    let data = {
      username: e.target.username.value,
      password: e.target.password.value,
    };

    try {
      login(data)
        .then((res) => {
          if (res.status === 200) {
            if (window !== undefined) {
              localStorage.setItem("jwt", res.data.token);
              localStorage.setItem("user", res.data.user);
            }
            router.push("/");
          } else if (res.status === 401) {
            toast.error("Invalid username or password");
          } else {
            console.error(res);
            toast.error("Error logging in");
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error logging in");
          throw new Error(err);
        });
    } catch (err) {
      console.error(err);
      toast.error("Error logging in");
    }
  }

  return (
    <form className="w-[400px] max-w-full" onSubmit={handleLoginSubmit}>
      <Image src={logo} alt="Leafbox logo" width={"auto"} height={70}  className="mx-auto my-4" priority/>
      <label htmlFor="username" className="text-sm font-medium">
        Username
      </label>
      <input
        type="text"
        name="username"
        id="username"
        placeholder="Enter your username"
        className="w-full rounded py-2 px-4 mb-3 text-sm bg-gray-700/20"
      />
      <label htmlFor="password" className="text-sm font-medium">
        Password
      </label>
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        className="w-full rounded py-2 px-4 mb-3 text-sm bg-gray-700/20"
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
  );
};

export default LoginBox;
