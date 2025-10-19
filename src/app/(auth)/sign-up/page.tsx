import type { Metadata } from "next";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Login Auth | Sign up",
};

export default function SignIn() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <SignUpForm />
    </main>
  );
}
