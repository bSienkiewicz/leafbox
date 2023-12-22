"use server";

function url(params) {
  return `${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_ROUTE}/${params}`;
}

export const addPlant = async (plant) => {
  const res = await fetch(url("plants"), {
    method: "POST",
    body: JSON.stringify(plant),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  const status = res.status;
  return { data, status };
};

export const getPlants = async () => {
  const res = await fetch(url("plants"), {
    method: "GET",
  });

  const data = await res.json();
  const status = res.status;
  return { data, status };
};

export const deletePlant = async (plant) => {
  const res = await fetch(url(`plants/${plant.plant_id}`), {
    method: "DELETE",
  });

  const data = await res.json();
  const status = res.status;
  return { data, status };
};

export const getPlantAndReadings = async (id, ammount) => {
  const res = await fetch(url(`plants/${id}/readings/${ammount}`), {
    method: "GET",
  });
  const data = await res.json();
  const status = res.status;
  return { data, status };
};

export const getLastPlantUpdates = async (ammount) => {
  const res = await fetch(url(`plants/updates/${ammount}`), {
    cache: "no-cache",
    method: "GET",
  });
  const data = await res.json();
  const status = res.status;
  return { data, status };
};

export const getReadings = async (ammount) => {
  const res = await fetch(url(`readings/${ammount}`), {
    method: "GET",
  });
  const data = await res.json();
  const status = res.status;
  return { data, status };
};

export const getDevices = async () => {
  const res = await fetch(url("devices"), {
    method: "GET",
  });
  const data = await res.json();
  const status = res.status;
  return { data, status };
};

export const getDevice = async (id) => {
  const res = await fetch(url(`devices/${id}`), {
    method: "GET",
  });
  const data = await res.json();
  const status = res.status;
  return { data, status };
};

export const modifyDevice = async (device) => {
  const res = await fetch(
    url(`devices/${device.device_id}`),
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(device),
    }
  );
  const json = await res.json();
  return json;
};

export const modifyPlant = async (plant) => {
  const res = await fetch(
    url(`plants/${plant.plant_id}`),
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(plant),
    }
  );
  const json = await res.json();
  return json;
};

export const getPlantExpert = async (search) => {
  const res = await fetch(url(`plants/lookup/${search}`), {
    method: "GET",
  });
  const data = await res.json();
  const status = res.status;
  return { data, status };
};

export const uploadImage = async (formData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  const status = res.status;
  return { data, status };
};


export const login = async (data) => {
  const res = await fetch(
    url("login"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const json = await res.json();
  return json;
}

export const register = async(data) => {
  const res = await fetch(
    url("register"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const json = await res.json();
  return json;
}

export const checkIfUserRegistered = async() => {
  const res = await fetch(
    url("registered"),
    {
      method: "GET",
    }
  );
  const json = await res.json();
  return json;
}