"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTokenStore } from "@/store/zustand";
import Card from "@/components/Cards/Card";
import toast from "react-hot-toast";

const LogoutPage = () => {
  const router = useRouter();
  const removeToken = useTokenStore((s) => s.removeToken);

  useEffect(() => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    removeToken();
    router.push("/login");
    toast.success("Logged out successfully");
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Card cClass="text-center text-xl">Logging you out...</Card>
    </div>
  );
};

export default LogoutPage;
