"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Title, TitleContent, TitleOption } from "@/components/Title";
import { Button } from "@/components/ui/button";
import { addPlant, getPlantExpert, uploadImage } from "@/app/_actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PlantAdd = () => {
  const router = useRouter();
  const [plant, setPlant] = useState({
    plant_name: "",
    location: "",
    species: "",
    description: "",
    lower_threshold: 0,
    upper_threshold: 0,
    temperature_min: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchPlantInfo, setSearchPlantInfo] = useState(null);

  const handleInputChange = (event, type) => {
    setPlant((prevPlant) => ({
      ...prevPlant,
      [type]: event.target.value,
    }));
  };

  const handleExpertSearch = async (event) => {
    event.preventDefault();
    const res = await getPlantExpert(event.target.search.value);
    if (res.status === 200) {
      setSearchResults(res.data);
    } else {
      toast.error("Couldn't find any plants");
    }
  };

  const handleExpertClick = (type, value) => {
    setPlant((prevPlant) => ({
      ...prevPlant,
      [type]: value,
    }));
  };

  const handleAddToDescription = (value) => {
    setPlant((prevPlant) => ({
      ...prevPlant,
      description:
        prevPlant.description +
        `${prevPlant.description.length > 0 ? "\n" : ""}` +
        value +
        ". ",
    }));
  };

  useEffect(() => {
    console.log(searchPlantInfo);
  }, [searchPlantInfo]);

  useEffect(() => {
    console.log(plant);
    if (plant.image) {
      const fetchNewPlant = async () => {
        await addPlant(plant)
          .then((res) => {
            if (res.status === 200) {
              toast.success("Plant added");
              router.replace(`/plants`);
            } else {
              toast.error("Couldn't add plant");
            }
          })
          .catch((err) => {
            toast.error("Couldn't add plant");
          });
      };
      fetchNewPlant();
    }
  }, [plant]);

  useEffect(() => {
    if (!imageFile) {
      setImageUrl(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  const handleSubmit = async () => {
    if (
      plant.plant_name === "" ||
      plant.lower_threshold === null ||
      plant.upper_threshold === null ||
      plant.upper_threshold < plant.lower_threshold
    ) {
      toast.error("There is an error with your input.");
      return;
    }
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await uploadImage(formData);
      if (res.status === 200) {
        toast.success("Image uploaded");
        console.log(res.data);
        setPlant((prevPlant) => ({
          ...prevPlant,
          image: res.data.image,
          color: res.data.color,
        }));
      } else {
        toast.error("Couldn't upload image");
      }
    }
  };

  return (
    <div className="relative flex flex-col gap-3">
      <Title>
        <TitleContent>Plants</TitleContent>
        <TitleOption>
          <Button onClick={handleSubmit}>Submit</Button>
        </TitleOption>
      </Title>
      <div className="flex flex-col gap-3">
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-[100px,1fr] gap-3 items-center">
            <Label htmlFor="plantName">
              Plant name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="plantName"
              id="plantName"
              placeholder="Enter a name for this plant"
              onChange={(e) => handleInputChange(e, "plant_name")}
              value={plant.plant_name}
              required
            />
            <Label htmlFor="location">Location</Label>
            <Input
              type="text"
              name="species"
              id="species"
              onChange={(e) => handleInputChange(e, "location")}
              value={plant.location}
              placeholder="Enter a location for this plant"
            />
            <Label htmlFor="location">Latin name</Label>
            <Input
              type="text"
              name="species"
              id="species"
              onChange={(e) => handleInputChange(e, "species")}
              value={plant.species}
              placeholder="Enter a latin name for this plant"
            />
            <Label
              htmlFor="image"
              className="w-full aspect-square cursor-pointer rounded-lg !bg-gray-900 mx-auto flex items-center text-center text-xs p-2 relative z-0"
              style={{ background: `url(${imageUrl}) center center/cover` }}
            >
              <input
                type="file"
                className="hidden"
                name="image"
                id="image"
                onChange={(e) => setImageFile(e.target.files?.[0])}
              />
            </Label>
            {!imageFile ? (
              <p className="text-sm">
                <FontAwesomeIcon icon={faArrowLeft} className="pr-2" />
                Add an image for this plant
              </p>
            ) : (
              <p className="text-sm text-green-200">
                <Button onClick={() => setImageFile(null)}>
                  Click here to remove it
                </Button>
              </p>
            )}
          </div>
        </Card>
        <Card className={""}>
          <CardHeader>
            <CardTitle>Plant description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="desc"
              id="desc"
              rows={6}
              className="w-full resize-none"
              placeholder="Enter a description for this plant"
              value={plant.description}
              onChange={(e) => handleInputChange(e, "description")}
            />
          </CardContent>
        </Card>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-4">
            <Card className={"flex flex-col gap-3 p-6"}>
              <div className="">
                <p className="text-sm text-gray-300 mb-3">
                  Soil moisture <span className="text-red-500">*</span>
                </p>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    className="bg-white/20 rounded-md px-3 py-1 text-md w-full"
                    name="lower_threshold"
                    id="lower_threshold"
                    min={0}
                    max={100}
                    onChange={(e) => handleInputChange(e, "lower_threshold")}
                    value={plant.lower_threshold}
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    className="bg-white/20 rounded-md px-3 py-1 text-md w-full"
                    name="upper_threshold"
                    id="upper_threshold"
                    onChange={(e) => handleInputChange(e, "upper_threshold")}
                    min={0}
                    max={100}
                    value={plant.upper_threshold}
                    placeholder="Max"
                  />
                </div>
              </div>
              <div className="">
                <p className="text-sm text-gray-300 mb-3">
                  Minimum Temperature
                </p>
                <input
                  type="number"
                  className="bg-white/20 rounded-md px-3 py-1 text-md w-full"
                  name="temperature_min"
                  id="temperature_min"
                  onChange={(e) => handleInputChange(e, "temperature_min")}
                  value={plant.temperature_min}
                  placeholder="Minimum temperature"
                />
              </div>
            </Card>
          </div>
          <div className="col-span-8">
            <Card className={"overflow-y-auto p-6"}>
              <div className={"flex flex-row justify-between mb-4"}>
                <div className="flex flex-col">
                  <p className="font-medium">Plant Expert</p>
                  <p className="text-gray-400 text-sm">
                    Search for a plant to get to know your plants better!
                  </p>
                </div>

                <Button onClick={() => setSearchDialogOpen(true)}>
                  Search plant
                </Button>
                <Dialog
                  open={searchDialogOpen}
                  onOpenChange={() => setSearchDialogOpen(false)}
                >
                  <DialogContent className="sm:max-w-[525px] max-h-[80%] overflow-auto">
                    <DialogHeader>
                      <DialogTitle>Search for a plant</DialogTitle>
                      <DialogDescription>
                        You can find your plant by their common name or species
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => handleExpertSearch(e)}
                      className="flex gap-3"
                    >
                      <Input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Enter a search phrase"
                      />
                      <Button type="submit">Search</Button>
                    </form>
                    {searchResults && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Common Name</TableHead>
                            <TableHead>Latin name</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className={"max-h-[300px] overflow-auto"}>
                          {searchResults.map((plant, i) => (
                            <TableRow
                              key={i}
                              onClick={() => {
                                setSearchPlantInfo(plant);
                                setSearchDialogOpen(false);
                              }}
                            >
                              <TableCell className="font-medium">
                                {plant.common_name}
                              </TableCell>
                              <TableCell>{plant.latin_name}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
              {searchPlantInfo && (
                <div>
                  <p className="pb-3 text-sm">
                    Here's what we know about this plant:
                  </p>

                  <div className="flex flex-wrap gap-3 items-center">
                    {searchPlantInfo.common_name && (
                      <div
                        className="bg-white hover:bg-white/90 transition-all text-black rounded px-2 py-1 cursor-pointer"
                        onClick={() =>
                          handleExpertClick(
                            "plant_name",
                            searchPlantInfo.common_name
                          )
                        }
                      >
                        <span>Common name: {searchPlantInfo.common_name}</span>
                      </div>
                    )}

                    {searchPlantInfo.latin_name && (
                      <div
                        className="bg-white hover:bg-white/90 transition-all text-black rounded px-2 py-1 cursor-pointer"
                        onClick={() =>
                          handleExpertClick(
                            "species",
                            searchPlantInfo.latin_name
                          )
                        }
                      >
                        <span>Latin name: {searchPlantInfo.latin_name}</span>
                      </div>
                    )}

                    {searchPlantInfo.moisture && (
                      <div className="bg-white hover:bg-white/90 transition-all text-black rounded px-2 py-1">
                        <span>Moisture: {searchPlantInfo.moisture}°C</span>
                      </div>
                    )}

                    {searchPlantInfo.temperature_min && (
                      <div
                        className="bg-white hover:bg-white/90 transition-all text-black rounded px-2 py-1 cursor-pointer"
                        onClick={() =>
                          handleExpertClick(
                            "temperature_min",
                            searchPlantInfo.temperature_min
                          )
                        }
                      >
                        <span>
                          Minimum temperature: {searchPlantInfo.temperature_min}
                          °C
                        </span>
                      </div>
                    )}

                    {searchPlantInfo.sun && (
                      <div
                        className="bg-white hover:bg-white/90 transition-all text-black rounded px-2 py-1 cursor-pointer"
                        onClick={() =>
                          handleAddToDescription(
                            `Enjoys ${searchPlantInfo.sun}`
                          )
                        }
                      >
                        <span>Sun exposure: Enjoys {searchPlantInfo.sun}</span>
                      </div>
                    )}

                    {searchPlantInfo.usda && (
                      <div
                        className="bg-white hover:bg-white/90 transition-all text-black rounded px-2 py-1 cursor-pointer"
                        onClick={() =>
                          handleAddToDescription(
                            `USDA Hardiness: ${searchPlantInfo.usda}`
                          )
                        }
                      >
                        <span>USDA Hardiness: {searchPlantInfo.usda}</span>
                      </div>
                    )}

                    {searchPlantInfo.medicinal && (
                      <span>
                        Medicinal uses: {(searchPlantInfo.medicinal / 5) * 100}%
                      </span>
                    )}

                    {searchPlantInfo.edibility && (
                      <span>
                        Edibility rating:{" "}
                        {(searchPlantInfo.edibility / 5) * 100}%
                      </span>
                    )}

                    {searchPlantInfo.edible_parts && (
                      <div
                        className="bg-white hover:bg-white/90 transition-all text-black rounded px-2 py-1 cursor-pointer"
                        onClick={() =>
                          handleAddToDescription(
                            `Edible parts: ${searchPlantInfo.edible_parts}`
                          )
                        }
                      >
                        <span>
                          Edible parts: {searchPlantInfo.edible_parts}
                        </span>
                      </div>
                    )}

                    {searchPlantInfo.hazards && (
                      <div
                        className="bg-white hover:bg-white/90 transition-all text-black rounded px-2 py-1 cursor-pointer"
                        onClick={() =>
                          handleAddToDescription(
                            `Known hazards: ${searchPlantInfo.hazards}`
                          )
                        }
                      >
                        <span>Known hazards: {searchPlantInfo.hazards}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const plantExpertInfo = (info) => {
  return (
    <div className="flex gap-1 flex-nowrap">
      <span>Moisture:</span>
      <span>
        {info ? (
          <span>{info}</span>
        ) : (
          <span className="text-red-500">Unknown</span>
        )}
      </span>
    </div>
  );
};

export default PlantAdd;
