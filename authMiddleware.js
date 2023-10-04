'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { validate } from "./lib/db";

export function checkAuth(Component) {
  const AuthenticatedComponent = (props) => {
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();
    const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

    useEffect(() => {
      if (!token) {
        toast.error("You must be logged in to view this page");
        router.push("/login");
      } else {
        validate(token).then((res) => {
          setAuthenticated(true);
        }).catch((err) => {
          toast.error("Invalid token, please log in again");
          router.push("/login");
        });
      }
    }, []);

    if (!token) {
      return null;
    }

    if (authenticated) {
      return <Component {...props} />;
    } else {
      return null;
    }
  };

  return AuthenticatedComponent;
}