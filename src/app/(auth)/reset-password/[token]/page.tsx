import type { Metadata } from "next";
import ResetPassword from "../reset-password-form";

export const metadata: Metadata = {
  title: "Login Auth | Forget Password",
};

export default async function SignIn({
  params,
}: Readonly<{ params: { token: string } }>) {
  const { token } = await params;
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <ResetPassword token={token} />
    </main>
  );
}
