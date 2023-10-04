import axios from "axios";

function url(params) {
  return `http://${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_ROUTE}/${params}`;
}

export async function getPlants() {
  const res = await fetch(url("plants"));
  const data = await res.json();
  return data;
}

export async function getPlant(id) {
  const res = await fetch(url(`plants/${id}`));
  const data = await res.json();
  return data;
}

export async function getPlantAndReadings(id, ammount) {
  const res = await fetch(url(`plants/${id}/readings/${ammount}`));
  const data = await res.json();
  return data;
}

export async function getDevices() {
  const res = await fetch(url("devices"));
  const data = await res.json();
  return data;
}
export async function getDevice(id) {
  const res = await fetch(url(`devices/${id}`));
  const data = await res.json();
  return data;
}

export async function putDevice(id, data) {
  const res = await fetch(url(`devices/${id}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res;
}

export async function login(data) {
  try{
    const res = await axios.post(url("login"), data);
    return res;
  } catch (err) {
    return err.response;
  }
}

export async function register(data) {
  try {
    const res = await axios.post(url("register"), data);
    return res;
  } catch (err) {
    return err.response;
  }
}

export async function validate(token) {
  
  try {
    const res = await axios.post(url("validate"), { token });
    return res;
  } catch (err) {
    return err.response;
  }
}