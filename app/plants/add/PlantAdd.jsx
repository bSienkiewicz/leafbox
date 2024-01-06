"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PlantAdd = () => {
  const router = useRouter();
  const [plant, setPlant] = useState({
    plant_name: "",
    location: "",
    species: "",
    description: "",
    lower_threshold: 40,
    upper_threshold: 80,
    reading_delay: 10,
    reading_delay_mult: 60,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [readingDelayMult, setReadingDelayMult] = useState(60);
  const [readingDelay, setReadingDelay] = useState(10);

  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchPlantInfo, setSearchPlantInfo] = useState(null);
  const [plantInfoMoisture, setPlantInfoMoisture] = useState(null);

  const theme = localStorage.getItem("theme") || "system";


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

  useEffect(() => {
    setPlant((prevPlant) => ({ ...prevPlant, reading_delay: readingDelay, reading_delay_mult: readingDelayMult }));
  }, [readingDelay, readingDelayMult]);

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
    const moistureThresholds = {
      D: { lower: 33, upper: 44 },
      M: { lower: 55, upper: 80 },
      W: { lower: 70, upper: 100 },
    };

    let moisture = searchPlantInfo?.moisture;
    if (moisture) {
      let lowerMoistureThreshold = moistureThresholds[moisture[0]].lower;
      let higherMoistureThreshold =
        moistureThresholds[moisture[moisture.length - 1]].upper;

      setPlantInfoMoisture({
        lowerMoistureThreshold,
        higherMoistureThreshold,
      });
    }
    console.log(searchPlantInfo);
  }, [searchPlantInfo]);

  useEffect(() => {
    console.log(plant);
    if (plant.send) {
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
          });};
      fetchNewPlant();
    }
  }, [plant]);

  useEffect(() => {
    const accepted = ["image/png", "image/jpeg", "image/jpg"];
    if (imageFile && !accepted.includes(imageFile.type)) {
      toast.error("Please select an image with .png or .jpg extension");
      setImageFile(null);
      return;
    }
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
      plant.upper_threshold < plant.lower_threshold ||
      plant.reading_delay === null ||
      plant.reading_delay <= 0
    ) {
      toast.error("There is an error with your input.");
      return;
    }
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await uploadImage(formData);
      if (res.status === 200) {
        setPlant((prevPlant) => ({
          ...prevPlant,
          image: res.data.image,
          color: res.data.color,
        }));
      } else {
        toast.error("Couldn't upload image");
      }
    }
    setPlant((prevPlant) => ({
      ...prevPlant,
      send: true,
    }));
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
              className="w-1/2 md:w-full aspect-square cursor-pointer rounded-lg !bg-gray-900 mx-auto flex items-center text-center text-xs p-2 relative z-0"
              style={{ background: `url(${imageUrl}) center center/cover` }}
            >
              <input
                type="file"
                className="hidden"
                name="image"
                id="image"
                accept="image/jpg,image/jpeg,image/png"
                onChange={(e) => setImageFile(e.target.files?.[0])}
              />
            </Label>
            {!imageFile ? (
              <p className="text-sm">Add an image for this plant</p>
            ) : (
              <p className="text-sm text-green-200">
                <Button onClick={() => setImageFile(null)}>
                  Click here to remove it
                </Button>
              </p>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-4">
            <Card className={"flex flex-col gap-3 p-6"}>
              <div className="">
                <p className="text-sm text-gray-400 mb-3">
                  Soil moisture (%)<span className="text-red-500">*</span>
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
                <p className="text-sm text-gray-400 mb-3">
                  How often should the device check this plant's soil moisture?{" "}
                  <span className="text-red-500">*</span>
                </p>
                <div className="flex gap-3 w-full flex-col">
                  <input
                    type="number"
                    className="bg-white/20 rounded-md px-3 py-1 text-md flex-1"
                    name="reading_delay"
                    id="reading_delay"
                    onChange={(e) => setReadingDelay(e.target.value)}
                    value={readingDelay}
                    placeholder="10"
                  />
                  <RadioGroup
                    defaultValue={readingDelayMult}
                    className="flex flex-row"
                    onValueChange={(e) => setReadingDelayMult(e)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={1} id="r1" />
                      <Label htmlFor="r1">Seconds</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={60} id="r2" />
                      <Label htmlFor="r2">Minutes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={3600} id="r3" />
                      <Label htmlFor="r3">Hours</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </Card>
          </div>
          <div className="col-span-12 md:col-span-8">
            <Card className={"overflow-y-auto p-6"}>
              <div className={"flex flex-row justify-between mb-4"}>
                <div className="flex flex-col">
                  <p className="font-medium">Find your plant</p>
                  <p className="text-gray-400 text-sm">
                    Search for your plant in the database
                  </p>
                </div>

                <Button onClick={() => setSearchDialogOpen(true)}>
                  Search for a plant
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

                    {plantInfoMoisture?.lowerMoistureThreshold && (
                      <div
                        className="bg-white hover:bg-white/90 transition-all text-black rounded px-2 py-1 cursor-pointer"
                        onClick={() => {
                          handleExpertClick(
                            "lower_threshold",
                            plantInfoMoisture.lowerMoistureThreshold
                          );
                          handleExpertClick(
                            "upper_threshold",
                            plantInfoMoisture.higherMoistureThreshold
                          );
                        }}
                      >
                        <span>
                          Recomended moisture:{" "}
                          {plantInfoMoisture.lowerMoistureThreshold}% -{" "}
                          {plantInfoMoisture.higherMoistureThreshold}%
                        </span>
                      </div>
                    )}

                    {searchPlantInfo.temperature_min && (
                      <div
                        className="bg-white hover:bg-white/90 transition-all text-black rounded px-2 py-1 cursor-pointer"
                        onClick={() =>
                          handleAddToDescription(
                            `Minimum temperature: ${searchPlantInfo.temperature_min}°C`
                          )
                        }
                      >
                        <span>
                          Minimum temperature: {searchPlantInfo.temperature_min}
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
