"use client";

import { useParams } from "next/navigation";
import QRCode from "qrcode.react";
import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import axios from "axios";
import { Button } from "@/components/ui/button";

const QRCodePage = () => {
  const { eventId } = useParams();
  const qrRef = useRef<HTMLDivElement>(null);
  const [eventName, setEventName] = useState("");

  const eventUrl = `https://localhost:3000/events/${eventId}/attendance`;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${eventId}`);
        setEventName(response.data.name);
      } catch (error) {
        console.error("Failed to fetch event details", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const downloadPDF = () => {
    const qrElement = qrRef.current;
    if (qrElement) {
      const doc = new jsPDF();
      doc.text("Event QR Code", 10, 10);
      doc.addImage(
        qrElement.children[0] as HTMLCanvasElement,
        "PNG",
        15,
        40,
        180,
        160
      );
      doc.save(`${eventName || "event"}-qrcode.pdf`);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="p-6 flex flex-col max-w-sm justify-center items-center">
        <h1 className="text-2xl font-medium">Event QR Code</h1>
        <div ref={qrRef} className="my-4">
          <QRCode value={eventUrl} size={256} />
        </div>
        <Button onClick={downloadPDF} className="button">
          Download QR Code as PDF
        </Button>
      </div>
    </div>
  );
};

export default QRCodePage;
