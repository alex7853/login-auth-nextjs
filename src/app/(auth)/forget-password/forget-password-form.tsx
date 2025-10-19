"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgetPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<any>("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (res.status === 400) {
        setError("User with this email does not exist.");
      }

      if (res.status === 200) {
        setError("");
        router.push("/sign-in");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Forget Password</CardTitle>
        <CardDescription>
          Enter your email below to reset your password
        </CardDescription>
        <CardAction>
          <Link href={'sign-in'}>
            <Button variant="link">Back</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && (
              <div className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Button disabled={loading} type="submit" className="w-full">
                Reset your Password
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
