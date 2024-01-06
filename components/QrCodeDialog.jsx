"use client";
import { useQRCode } from "next-qrcode";
import React from "react";
import { Input } from "./ui/input";

const QrCodeDialog = ({opaque = false}) => {
  const { Canvas } = useQRCode();
  const [url, setUrl] = React.useState("http://192.168.4.1");
  const [parameters, setParameters] = React.useState("");
  return (
    <div className={`flex flex-col items-center gap-3 ${opaque && "opacity-40"}`}>
      <ol className="list-decimal text-sm">
        <li>
          Connect to the device's access point with your phone
        </li>
        <li>
          Scan the QR code with your phone's camera or connect to 192.168.4.1 with your browser
        </li>
        <li>
          Configure your device
        </li>
        <li>
          The device should now connect to your WiFi network and be visible in the app
        </li>
      </ol>
      <Canvas
        text={url + parameters}
        options={{
          errorCorrectionLevel: "M",
          margin: 3,
          scale: 4,
          width: 100,
          color: {
            dark: "#fff",
            light: "#ffffff00",
          },
        }}
      />
    </div>
  );
};

export default QrCodeDialog;
