import SidebarBody from "./Sidebar/SidebarBody";

const Searchbar = () => {
  const fetchPlants = async () => {
      "use server";
  
      const res = await fetch(
        `http://${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_ROUTE}/plants`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      const status = res.status;
      return {data, status};
    };

    const fetchDevices = async () => {
        "use server";
    
        const res = await fetch(
          `http://${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_ROUTE}/devices`,
          {
            method: "GET",
          }
        );
        const data = await res.json();
        const status = res.status;
        return {data, status};
      };

  return (
    <SidebarBody fetchPlants={fetchPlants} fetchDevices={fetchDevices}/>
  );
};

export default Searchbar;
