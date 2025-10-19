import type { Metadata } from "next";
import ForgetPasswordForm from "./forget-password-form";

export const metadata: Metadata = {
  title: "Login Auth | Forget Password",
};

export default function SignIn() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <ForgetPasswordForm /> 
    </main>
  );
}
