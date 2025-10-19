import { auth } from "@/auth";
import UnauthorizedPage from "../unauthorized";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (session) return redirect("dashboard");

  return <div className="flex min-h-screen flex-col">{children}</div>;
}
