import Link from "next/link";
import { useAuth } from "@/authMiddleware";
import { Card } from "@/components/ui/card";
import { Title, TitleContent, TitleOption } from "@/components/Title";
import { getDevices, getPlants } from "../_actions";
import Error from "@/components/Error";

const page = async () => {
  await useAuth();
  let error = false;
  const plants = await getPlants()
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      error = true;
    });
  const devices = await getDevices()
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      error = true;
    });

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Error
          err={
            "Error loading data from the API. Is the API server running? Check the server logs for more info."
          }
          action={"refresh"}
        />
      </div>
    );
  }

  if (devices && plants) {
    return (
      <div className="h-full w-full overflow-x-visible overflow-y-auto">
        <Title>
          <TitleContent>Devices</TitleContent>
        </Title>
        {devices && (
          <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-3">
            {devices.map((device, i) => (
              <Link
                href={`/devices/${device[`device_id`]}`}
                className={`w-full isolate relative h-full group`}
                key={i}
              >
                <Card
                  className={`p-6 ${
                    !device.configured ? "border-2 border-red-200" : null
                  }`}
                >
                  {!device.configured && (
                    <div className="absolute bottom-0 right-0 text-xs text-black rounded-tl-lg rounded-br-lg bg-red-200 font-light px-2 py-1">
                      Not configured
                    </div>
                  )}
                  <h3 className="text-xl font-bold">{device[`device_name`]}</h3>
                  <h4 className="text-sm text-gray-300 pt-2">
                    Location: {device[`location`]}
                  </h4>
                  <div className="absolute h-3 w-3 top-5 right-5">
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
  }
};

export default page;
