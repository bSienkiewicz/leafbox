import { getPlants } from "@/lib/db";
import { useAuth } from "@/authMiddleware";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { TitleContent, TitleOption, Title } from "@/components/Title";
import { Button } from "@/components/ui/button";

const page = async () => {
  await useAuth();
  const plants = await getPlants();

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
              <Card className="w-full h-full flex p-3 gap-3 overflow-hidden text-ellipsis">
                <div
                  className="w-16 md:w-32 h-16 min-h-[64px] md:min-h-[128px] rounded-lg relative"
                  style={
                    plant.image
                      ? {
                          background: `url(${plant.image}) center center / cover no-repeat`,
                        }
                      : {
                          background: `url(/placeholder.webp) center center / cover no-repeat`,
                        }
                  }
                >
                  {plant.last_moisture && (
                    <div
                      className={`absolute isolate bottom-1 left-1 bg-white text-black font-bold overflow-hidden text-xs px-4 py-1 rounded-sm`}
                    >
                      <div
                        className="absolute top-0 left-0 bg-blue-300 h-full -z-10"
                        style={{ width: `${plant.last_moisture}%` }}
                      ></div>
                      <p className="z-10">55%</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 justify-between">
                  <h3 className="text-3xl font-medium">{plant.plant_name}</h3>
                  <div className="">
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
