import { useAuth } from "@/authMiddleware";
import PlantAdd from "./PlantAdd";

const page = () => {
  useAuth();
  
  return <PlantAdd />;
};

export default page;
