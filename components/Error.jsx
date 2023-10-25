"use client";
import React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  faChevronLeft,
  faChevronRight,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./ui/button";

const Error = ({ err, action = "refresh" }) => {
  const reloadWindow = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const back = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <Card className="max-w-[450px] w-full">
      <CardHeader>
        <CardTitle>Error</CardTitle>
        <CardDescription>{err}</CardDescription>
      </CardHeader>
      <CardFooter className="justify-center">
        {action === "refresh" && (
          <Button className="btn btn-primary" onClick={reloadWindow}>
            <FontAwesomeIcon icon={faRotateRight} className="pr-2" />
            Refresh
          </Button>
        )}
        {action === "back" && (
          <Button className="btn btn-primary" onClick={back}>
            <FontAwesomeIcon icon={faChevronLeft} className="pr-2" />
            Back
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Error;
