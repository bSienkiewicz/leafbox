import { useAuth } from "@/authMiddleware";
import { Title, TitleContent } from "@/components/Title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getReadings } from "./_actions";
import RecentReadings from "@/components/Cards/RecentReadings";
import moment from "moment";
import Error from "@/components/Error";
import Usage from "@/components/Cards/Usage";

const Home = async () => {
  await useAuth();
  let error = false;
  const readings = await getReadings(4)
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

  if (readings) {
    return (
      <>
        {/* <div
        className="absolute top-0 left-0 w-full h-full -z-20 animate-fade-in"
        style={{ background: "url(/leafbg.jpg) center center/cover no-repeat" }}
      >
        <div className="w-full h-full relative bg-black/50" />
      </div> */}
        <div className="flex flex-col lg:grid grid-cols-12 gap-3">
          <Title className={"col-span-12"}>
            <TitleContent>Hello</TitleContent>
          </Title>
          <Card className="col-span-8">
            <CardHeader>
              <CardTitle>Last readings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Plant Name</TableHead>
                    <TableHead className="text-right">Moisture</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {readings &&
                    readings.map((reading) => (
                      <TableRow key={reading.reading_id}>
                        <TableCell className="font-medium">
                          {moment(reading.timestamp).format("DD/MM/YY HH:mm")}
                        </TableCell>
                        <TableCell>{reading.plant_name}</TableCell>
                        <TableCell className="text-right">
                          {reading.moisture_value}%
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="flex flex-col col-span-4 gap-3">
            <RecentReadings />
          </div>
          
          <div className="flex flex-col col-span-4 gap-3">
            <Usage />
          </div>
        </div>
      </>
    );
  }
};

export default Home;
