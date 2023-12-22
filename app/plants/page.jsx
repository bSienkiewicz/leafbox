import { getPlants } from "@/app/_actions";
import { useAuth } from "@/authMiddleware";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { TitleContent, TitleOption, Title } from "@/components/Title";
import { Button } from "@/components/ui/button";
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

  if (plants) {
    return (
      <div className="relative h-full">
        <Title>
          <TitleContent>Plants</TitleContent>
          <TitleOption>
            <Link href="/plants/add" passHref>
              <Button>
                <FontAwesomeIcon icon={faPlus} className="pr-2" />
                Add
              </Button>
            </Link>
          </TitleOption>
        </Title>
        {plants && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {plants?.map((plant, i) => (
              <Link href={`/plants/${plant.plant_id}`} key={i}>
                <Card className="w-full h-full flex flex-col p-3 gap-3 overflow-hidden text-ellipsis relative isolate">
                  {/* <div
                  className="absolute top-0 left-0 w-full h-full -z-20 opacity-10"
                  style={{
                    background: `linear-gradient(90deg, ${plant.color} 0%, transparent 30%)`,
                  }}
                ></div> */}
                  <div className="flex gap-3">
                    <div
                      className={`w-16 rounded-lg relative ${
                        !plant?.image ? "border-2 border-dashed" : "border-none"
                      }`}
                      style={
                        plant.image
                          ? {
                              background: `url(http://leafbox.ddns.net:5000/uploads/${plant.image}) center center / cover no-repeat`,
                            }
                          : null
                      }
                    ></div>
                    <div className="flex flex-col flex-1 justify-between py-3">
                      <div className="text-3xl font-medium flex justify-between items-center">
                        <span>{plant.plant_name}</span>
                        {plant.last_moisture && (
                          <span
                            className="font-bold text-lg text-gray-400"
                            style={{ color: plant.color }}
                          >
                            {plant.last_moisture}%
                          </span>
                        )}
                      </div>
                      {plant.species && (
                        <p className="text-xs text-gray-400 italic">
                          {plant.species}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs mt-2 tracking-normal">
                      Last watering:
                    </p>
                    <p className="text-xs text-gray-400">
                      {plant.last_moisture_ts
                        ? moment(plant.last_moisture_ts).fromNow() +
                          " (" +
                          moment(plant.last_moisture_ts).format(
                            "HH:mm DD/MM/YY"
                          ) +
                          ")"
                        : "Never"}
                    </p>
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
