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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { OrganizationForm } from "./organization-form";
import { useTheme } from "next-themes";

type UserInfoFormProps = {
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    organizationName?: string;
    activitySectorId?: number;
  };
};

const userFormSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required",
  }),
  email: z.string().email({
    message: "Valid email is required",
  }),
});

export const UserInfoForm = ({ initialData }: UserInfoFormProps) => {
  const [isEditingUser, setIsEditingUser] = useState(false);

  const toggleEditUser = () => setIsEditingUser((current) => !current);

  const router = useRouter();

  const userForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
    },
  });

  const { isSubmitting: isSubmittingUser, isValid: isValidUser } =
    userForm.formState;

  const onSubmitUser = async (values: z.infer<typeof userFormSchema>) => {
    try {
      await axios.patch(`/api/user`, values);
      toast.success("User information updated");
      toggleEditUser();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

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
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-background-2nd-level ">
      <div className="font-medium flex items-center justify-between">
        User Information
        <Button onClick={toggleEditUser} variant={buttonVariant}>
          {isEditingUser ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 mr-2" />
              Edit Info
            </>
          )}
        </Button>
      </div>
      {!isEditingUser && (
        <div className="text-sm mt-2">
          <p>
            <strong>First Name:</strong> {initialData.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {initialData.lastName}
          </p>
          <p>
            <strong>Email:</strong> {initialData.email}
          </p>
        </div>
      )}
      {isEditingUser && (
        <Form {...userForm}>
          <form
            onSubmit={userForm.handleSubmit(onSubmitUser)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={userForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmittingUser}
                      placeholder="First Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={userForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmittingUser}
                      placeholder="Last Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={userForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmittingUser}
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValidUser || isSubmittingUser} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
