import { useAuth } from "@/authMiddleware";
import DeviceSettings from "./DeviceSettings";
import { getDevice, getPlants } from "@/app/_actions";
import Error from "@/components/Error";

const page = async ({ params }) => {
  await useAuth();
  let error = false;

  const devices = await getDevice(params.id)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      error = err;
    });

  const plants = await getPlants()
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      error = err;
    });

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Error
          err={
            error
          }
          action={"refresh"}
        />
      </div>
    );
  }

  if (devices && plants) {
    return <DeviceSettings plants={plants} devices={devices} params={params} />;
  }

  // Handle the case when devices and plants are not fetched yet
  return <div>Loading...</div>;
};

export default page;
