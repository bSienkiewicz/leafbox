"use client"
import { useQRCode } from 'next-qrcode';
import React from 'react'
import { Input } from './ui/input';

const QrCodeDialog = () => {
  const { Canvas } = useQRCode();
  const [url, setUrl] = React.useState('http://192.168.4.1');
  const [parameters, setParameters] = React.useState('');
  return (
    <div className="flex flex-col items-center gap-3">
    <Canvas
      text={url + parameters}
      options={{
        errorCorrectionLevel: 'M',
        margin: 3,
        scale: 4,
        width: 150,
        color: {
          dark: '#000',
          light: '#fff',
        },
      }}
    />
    <p className='text-center text-sm text-gray-500'>Connect to the device's access point with your phone and scan the QR code to quickly set it up.</p>
    </div>
  )
}

export default QrCodeDialog