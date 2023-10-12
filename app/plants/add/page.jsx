import { useAuth } from "@/authMiddleware";
import PlantAdd from "./PlantAdd";

const page = () => {
  const addPlant = async (plant) => {
    "use server";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_ROUTE}/plants`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plant),
      }
    );
    
    const data = await res.json();
    const status = res.status;
    return { data, status };
  };

  const plantLookup = async (species) => {
      "use server";
  
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_ROUTE}/plants/lookup/${species}`
      );
      
      const json = await res.json();
      return json;
    };

  useAuth();
  return <PlantAdd addPlant={addPlant} plantLookup={plantLookup}/>;
};

export default page;
