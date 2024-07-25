"use client";

import { UserInfoForm } from "@/components/user-info-form";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import SectionCard from "@/components/section-card";
import { Organization } from "@prisma/client";
import { OrganizationForm } from "@/components/organization-form";
import axios from "axios";

const ProfilePage = () => {
  const { user, isLoaded } = useUser();
  const [initialData, setInitialData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    if (isLoaded && user) {
      setInitialData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      });
    }
  }, [isLoaded, user]);

  const [organizationData, setOrganizationData] = useState<Organization | null>(
    null
  );
  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        const { data } = await axios.get(`/api/organization`);
        setOrganizationData(data);
      } catch (error) {
        console.error("Failed to fetch organization data", error);
      }
    };
    fetchOrganizationData();
  }, []);

  if (!organizationData) {
    return;
  }

  return (
    <div className="p-4 max-w-auto mx-auto">
      <div className="p-6 shadow-lg rounded-lg">
        <UserInfoForm initialData={initialData} />
        <OrganizationForm initialData={organizationData} editable={true} />
        <div className="mt-6">
          <h2 className="text-xl font-bold m-4">My Sections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-12">
            <SectionCard
              title="My Events"
              description="View and manage your events."
              imageSrc={"/images/my-events.svg" || "/images/upload-image.svg"}
              link="/user/events"
            />
            <SectionCard
              title="My Participations"
              description="View your event participations."
              imageSrc={
                "/images/participations.svg" || "/images/upload-image.svg"
              }
              link="/user/participations"
            />
            <SectionCard
              title="My Attendances"
              description="Track your attendances."
              imageSrc={"/images/attendances.svg" || "/images/upload-image.svg"}
              link="/user/attendances"
            />
            <SectionCard
              title="My Analytics"
              description="Analyze your event statistics."
              imageSrc={"/images/analytics.svg" || "/images/upload-image.svg"}
              link="/user/analytics"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
