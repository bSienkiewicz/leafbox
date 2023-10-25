import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function useAuth() {
  const token = cookies().get("jwt")

  if (!token) {
    redirect("/logout");
  }
  
  
  await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_ROUTE}/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  }).then((res) => {
    if (!res.ok) {
      redirect("/logout");
    }
  }).catch((err) => {
    return false;
  });

  return true;
}
