import axios from "axios";

function url(params) {
  return `http://${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_ROUTE}/${params}`;
}

export async function getPlants() {
  try{
    const res = await axios.get(url("plants"));
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function getPlant(id) {
  try{
    const res = await axios.get(url(`plants/${id}`));
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function putPlant(id, data) {
  try {
    const res = await axios.put(url(`plants/${id}`), data);
    return res;
  } catch (err) {
    throw new Error(err);
  }
}

export async function addPlant(data) {
  try {
    const res = await axios.post(url(`plants`), data);
    return res;
  } catch (err) {
    throw new Error(err);
  }
}

export async function getPlantAndReadings(id, ammount) {
  try{
    const res = await axios.get(url(`plants/${id}/readings/${ammount}`));
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function getPlantLookup(species) {
  try{
    const res = await axios.get(url(`plants/lookup/${species}`));
    return res.data;
  } catch (err) {
    throw new Error(err.response.status);
  }
}

export async function getDevices() {
  try{
    const res = await axios.get(url("devices"));
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
}
export async function getDevice(id) {
  try{
    const res = await axios.get(url(`devices/${id}`));
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function putDevice(id, data) {
  try {
    const res = await axios.put(url(`devices/${id}`), data);
    return res;
  } catch (err) {
    throw new Error(err);
  }
}

export async function userLogin(data) {
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

export async function checkIfUserRegistered() {
  try {
    const res = await axios.get(url(`registered`));
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