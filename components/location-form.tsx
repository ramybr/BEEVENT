// /components/location-form.tsx

"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Event } from "@prisma/client";

const formSchema = z.object({
  location: z.string().min(1, "Location is required"),
});

type LocationFormProps = {
  initialData: Event;
  eventId: number;
};

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const LocationForm = ({ initialData, eventId }: LocationFormProps) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );
  const [addressSuggestions, setAddressSuggestions] = useState<Suggestion[]>(
    []
  );
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: initialData.location || "",
    },
  });

  useEffect(() => {
    if (initialData.location) {
      const fetchCoordinates = async () => {
        const response = await axios.get<Suggestion[]>(
          `https://nominatim.openstreetmap.org/search?format=json&q=${initialData.location}`
        );
        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
        }
      };
      fetchCoordinates();
    }
  }, [initialData.location]);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/events/${eventId}`, values);
      toast.success("Event location updated");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleAddressChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = e.target.value;
    if (query.length > 2) {
      const response = await axios.get<Suggestion[]>(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      setAddressSuggestions(response.data);
    }
  };

  const handleAddressSelect = (suggestion: Suggestion) => {
    setMarkerPosition([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
    form.setValue("location", suggestion.display_name);
    setAddressSuggestions([]);
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Event Location
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? <>Cancel</> : <>Edit</>}
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {isEditing ? (
            <>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter event location"
                        onChange={(e) => {
                          field.onChange(e);
                          handleAddressChange(e);
                        }}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                    {addressSuggestions.length > 0 && (
                      <ul className="absolute z-10 bg-white border mt-1 w-full">
                        {addressSuggestions.map((suggestion, idx) => (
                          <li
                            key={idx}
                            className="cursor-pointer p-2 hover:bg-gray-200"
                            onClick={() => handleAddressSelect(suggestion)}
                          >
                            {suggestion.display_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </FormItem>
                )}
              />
              <div className="h-64">
                {typeof window !== "undefined" && markerPosition && (
                  <MapContainer
                    center={markerPosition}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="h-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={markerPosition} />
                  </MapContainer>
                )}
              </div>
              <div className="flex items-center gap-x-2">
                <Button disabled={!isValid || isSubmitting} type="submit">
                  Save
                </Button>
                <Button onClick={toggleEdit} variant="ghost">
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <p>{form.getValues("location")}</p>
              <div className="h-64">
                {typeof window !== "undefined" && markerPosition && (
                  <MapContainer
                    center={markerPosition}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="h-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={markerPosition} />
                  </MapContainer>
                )}
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  );
};

export default dynamic(() => Promise.resolve(LocationForm), { ssr: false });
