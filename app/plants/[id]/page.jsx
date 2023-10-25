import { getPlantAndReadings } from "@/app/_actions";
import { useAuth } from "@/authMiddleware";
import Error from "@/components/Error";
import PlantID from "./PlantID";

const page = async ({ params }) => {
  await useAuth();
  const readingsAmmount = 15;
  let plant = null;
  let readings = null;
  let error = null;

  await getPlantAndReadings(params.id, readingsAmmount)
    .then((res) => {
      plant = res.data.plant[0];
      readings = res.data.readings;
      if (!plant) {
        error = "Couldn't find plant with ID \"" + params.id + '"';
      }
    })
    .catch((err) => {
      error =
        "Error loading data from the API. Is the API server running? Check the server logs for more info.";
    });

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Error err={error} action={"refresh"} />
      </div>
    );
  }

  if (plant && readings) {
    return (
      <div className="h-full w-full">
        <PlantID
          plant_res={plant}
          readings_res={readings}
          params={params}
          readingsAmmount={readingsAmmount}
        />
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default page;
