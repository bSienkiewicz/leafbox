import { getDevices, getPlants } from "@/lib/db";
import Link from "next/link";
import { useAuth } from "@/authMiddleware";
import Card from "@/components/Cards/Card";
import Error from "@/components/Error";

const page = async () => {
  await useAuth();
  let error = false;
  const plants = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_ROUTE}/plants`,
    { cache: "no-store" }
  ).then((res) => res.json());
  const devices = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_ROUTE}/devices`,
    { cache: "no-store" }
  )
    .then((res) => res.json())
    .catch((err) => {
      error = true;
    });

  return (
    <div className="h-full w-full overflow-x-visible overflow-y-auto">
      <p className="font-medium mb-3">Devices</p>
      {error && <Error err={"Couldn't retrieve devices"} />}
      {devices && (
        <div className="w-full grid md:grid-cols-2 md:grid-rows-none grid-cols-1 gap-3">
          {devices.map((device, i) => (
            <Link
              href={`/devices/${device[`device_id`]}`}
              className={`w-full isolate relative max-h-36 group`}
              key={i}
            >
              <Card
                cClass={`${
                  !device.configured ? "border-2 border-red-200" : ""
                }`}
              >
                {!device.configured && (
                  <div className="absolute bottom-0 right-0 text-xs text-black rounded-tl-lg bg-red-200 font-light p-2">
                    Not configured
                  </div>
                )}
                <h3 className="text-xl font-bold">{device[`device_name`]}</h3>
                <h4 className="text-sm text-gray-300 pt-2">
                  Location: {device[`location`]}
                </h4>
                <div className="absolute h-3 w-3 top-5 right-5">
                  <span
                    className={`animate-ping absolute rounded-full ${
                      device.configured ? "bg-green-300" : "bg-red-300"
                    } w-full h-full inline-flex opacity-70`}
                  ></span>
                  <span
                    className={`absolute rounded-full ${
                      device.configured ? "bg-green-300" : "bg-red-300"
                    } w-full h-full inline-flex`}
                  ></span>
                </div>
                <div className="mt-4 flex gap-2">
                  {Array(4)
                    .fill()
                    .map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-full h-8 w-8 border-dashed ${
                          device[`plant_${i + 1}`] == null
                            ? "border-gray-300 border-2"
                            : "bg-green-300"
                        }`}
                      ></div>
                    ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default page;
