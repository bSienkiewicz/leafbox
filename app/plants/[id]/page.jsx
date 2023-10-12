import { getPlantAndReadings, putPlant } from "@/lib/db";
import { useAuth } from "@/authMiddleware";
import Error from "@/components/Error";
import PlantDisplay from "./PlantDisplay";

const page = async({ params }) => {
  const modifyPlant = async (data) => {
    "use server";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_ROUTE}/plants/${params.id}`,
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
  }

  await useAuth();
  const readingsAmmount = 25;
  let plant = null;
  let readings = null;
  let loading = true;
  let error = null;

  await getPlantAndReadings(params.id, readingsAmmount).then((res) => {
    plant = res.plant[0];
    readings = res.readings;
    loading = false;
  }).catch((err) => {
    error = true;
  });

  return (
    <div className="h-full w-full">
      {error && (
        <div className="w-full h-full flex justify-center items-center">
          <Error
            err={`Couldn't find plant with ID \"` + params.id + `\"`}
            action={"back"}
          />
        </div>
      )}
      {plant && (
        <PlantDisplay plant_res={plant} readings_res={readings} loading_res={loading} modifyPlant={modifyPlant} params={params}/>
      )}
    </div>
  );
};

export default page;
