import { getDevice, getPlants, getDevices, putDevice } from "@/lib/db";
import DeviceSettings from "./DeviceSettings";

const page = async ({ params }) => {
  const modifyDevice = async (data) => {
    "use server";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_ROUTE}/devices/${params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const json = await res.json();
    return json;
  };

  const devices = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_ROUTE}/devices`,
    { cache: "no-store" }
  ).then((res) => res.json());

  const plants = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_ROUTE}/plants`,
    { cache: "no-store" }
  ).then((res) => res.json());

  return (
    devices &&
    plants && (
      <DeviceSettings
        plants={plants}
        devices={devices}
        params={params}
        modifyDevice={modifyDevice}
      />
    )
  );
};

export default page;
