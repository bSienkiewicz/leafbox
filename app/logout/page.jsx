"use client"
import { redirect} from "next/navigation";
import { useCookies } from "next-client-cookies";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { use } from "react";

const LogoutPage = () => {
  const router = useRouter();
  useCookies().remove("jwt");
  useCookies().remove("user");
  router.replace("/login");
};

export default LogoutPage;
