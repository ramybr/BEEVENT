"use client";

import { useParams } from "next/navigation";
import QRCode from "qrcode.react";
import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import axios from "axios";

const QRCodePage = () => {
  const { eventId } = useParams();
  const qrRef = useRef<HTMLDivElement>(null);
  const [eventName, setEventName] = useState("");

  const eventUrl = `https://localhost:3000/events/${eventId}`;

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
    <div className="p-6 flex justify-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-2xl font-medium">Event QR Code</h1>
        <div ref={qrRef} className="my-4">
          <QRCode value={eventUrl} size={256} />
        </div>
        <button onClick={downloadPDF} className="button">
          Download QR Code as PDF
        </button>
      </div>
    </div>
  );
};

export default QRCodePage;
