import { Navbar } from "./navbar";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import UnauthorizedPage from "../unauthorized";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session) return <UnauthorizedPage />;

  return (
    <div className="flex min-h-screen flex-col">
      <SessionProvider>
        <Navbar />
        {children}
      </SessionProvider>
    </div>
  );
}
