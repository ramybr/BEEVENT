import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { SearchUsers } from "./_search-users";
import { clerkClient } from "@clerk/nextjs";
import { setRole } from "./_actions";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard(params: {
  searchParams: { search?: string };
}) {
  if (!checkRole("admin")) {
    redirect("/");
  }

  const query = params.searchParams.search;

  const users = query
    ? await clerkClient.users.getUserList({ query })
    : await clerkClient.users.getUserList({});

  console.log(users);

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-medium">Admin Dashboard</h1>
      <p className="text-sm text-slate-700 mt-2">
        This page is restricted to users with the 'admin' role.
      </p>

      <SearchUsers />

      <div className="mt-6 space-y-4">
        {users.map((user) => (
          <div key={user.id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-lg font-medium">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-sm text-slate-700">
                  {
                    user.emailAddresses.find(
                      (email) => email.id === user.primaryEmailAddressId
                    )?.emailAddress
                  }
                </span>
                <span className="text-sm text-slate-700">
                  {user.publicMetadata.role as string}
                </span>
              </div>
              <div className="flex space-x-2">
                {user.publicMetadata.role === "moderator" && (
                  <form action={setRole}>
                    <input type="hidden" value={user.id} name="id" />
                    <input type="hidden" value="admin" name="role" />
                    <Button type="submit">Make Admin</Button>
                  </form>
                )}
                {user.publicMetadata.role === "admin" && (
                  <form action={setRole}>
                    <input type="hidden" value={user.id} name="id" />
                    <input type="hidden" value="moderator" name="role" />
                    <Button type="submit">Make Moderator</Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
