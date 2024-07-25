"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Combobox } from "@/components/ui/combobox";
import { Organization } from "@prisma/client";
import { useTheme } from "next-themes";

type ActivitySector = {
  id: number;
  name: string;
};

type OrganizationFormProps = {
  initialData: Organization;
  editable: boolean;
};

const formSchema = z.object({
  organizationName: z.string().optional(),
  activitySectorId: z.number().optional(),
});

export const OrganizationForm = ({
  initialData,
  editable,
}: OrganizationFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activitySectors, setActivitySectors] = useState<ActivitySector[]>([]);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: initialData.name || "",
      activitySectorId: initialData.activitySectorId || 0,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    const fetchActivitySectors = async () => {
      try {
        const { data } = await axios.get("/api/activity-sectors");
        setActivitySectors(data);
      } catch {
        toast.error("Failed to load activity sectors");
      }
    };

    fetchActivitySectors();
  }, []);

  useEffect(() => {
    form.reset({
      organizationName: initialData.name || "",
      activitySectorId: initialData.activitySectorId || 0,
    });
  }, [initialData, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/organization`, values);
      toast.success("Organization information updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const selectedActivitySector = activitySectors.find(
    (sector) => sector.id === initialData.activitySectorId
  );

  const { theme, resolvedTheme } = useTheme();

  type ButtonVariant =
    | "default"
    | "link"
    | "ghost-dark"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";

  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("ghost");

  useEffect(() => {
    const currentTheme: ButtonVariant =
      theme === "dark" || resolvedTheme === "dark" ? "ghost-dark" : "ghost";
    setButtonVariant(currentTheme);
  }, [theme, resolvedTheme]);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-background-2nd-level">
      <div className="font-medium flex items-center justify-between">
        Organization Information
        {editable && (
          <Button onClick={toggleEdit} variant={buttonVariant}>
            {isEditing ? (
              <>Cancel</>
            ) : (
              <>
                <Pencil className="h-4 mr-2" />
                Edit Info
              </>
            )}
          </Button>
        )}
      </div>
      {!isEditing && (
        <div className="text-sm mt-2">
          <p>
            <strong>Organization:</strong> {initialData.name || "N/A"}
          </p>
          <p>
            <strong>Activity Sector:</strong>{" "}
            {selectedActivitySector?.name || "N/A"}
          </p>
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Organization Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activitySectorId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={activitySectors.map((sector) => ({
                        label: sector.name,
                        value: sector.id,
                      }))}
                      value={field.value || undefined}
                      onChange={(value) => field.onChange(Number(value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                variant={buttonVariant}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
