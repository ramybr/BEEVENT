"use client";

import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Event } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

type ImageFormProps = {
  initialData: Event;
  eventId: number;
  editable: boolean;
};

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const ImageForm = ({
  initialData,
  eventId,
  editable,
}: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/events/${eventId}`, values);
      toast.success("Event edited");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      {editable && (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
          <div className="font-medium flex items-center justify-between">
            Event image
            <Button onClick={toggleEdit} variant="ghost">
              {isEditing && <>Cancel</>}
              {!isEditing && !initialData.imageUrl && (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add image
                </>
              )}
              {!isEditing && initialData.imageUrl && (
                <>
                  <Pencil className="h-4 m-4 mr-2" />
                  Edit image
                </>
              )}
            </Button>
          </div>
          {!isEditing &&
            (!initialData.imageUrl ? (
              <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                <ImageIcon className="h-10 w-10 text-slate-500" />
              </div>
            ) : (
              <div className="relative aspect-video mt-2">
                <Image
                  alt="Upload"
                  fill
                  className="object-cover rounded-md"
                  src={initialData.imageUrl || "/no-image-available.png"}
                  // layout="responsive"
                />
              </div>
            ))}
          {isEditing && (
            <div>
              <FileUpload
                endpoint="eventImage"
                onChange={(url: any) => {
                  if (url) {
                    onSubmit({ imageUrl: url });
                  }
                }}
              />
              <div className="text-xs text-muted-foreground mt-4">
                16:9 aspect ratio recommended
              </div>
            </div>
          )}
        </div>
      )}
      {!editable && (
        <div className="relative w-full h-60 md:h-96">
          <Image
            alt="Event Cover"
            src={initialData.imageUrl || "/no-image-available.png"}
            // layout="responsive"
            className="object-cover"
            fill
          />
        </div>
      )}
    </>
  );
};
