"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Password Strength Indicator Component
function PasswordStrengthIndicator({ password }: { password: string }) {
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    calculatePasswordStrength(password);
  }, [password]);

  const calculatePasswordStrength = (password: string) => {
    let newStrength = 0;

    if (password.length >= 8) newStrength += 25;
    if (password.length >= 12) newStrength += 15;
    if (/[A-Z]/.test(password)) newStrength += 20;
    if (/[a-z]/.test(password)) newStrength += 20;
    if (/[0-9]/.test(password)) newStrength += 20;
    if (/[^A-Za-z0-9]/.test(password)) newStrength += 20;

    setStrength(Math.min(newStrength, 100));
  };

  const getStrengthColor = () => {
    if (strength < 40) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (strength === 0) return "";
    if (strength < 40) return "Weak";
    if (strength < 70) return "Medium";
    return "Strong";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span>Password strength:</span>
        <span className={getStrengthColor().replace("bg-", "text-")}>
          {getStrengthText()}
        </span>
      </div>
      <div className="w-full bg-input/30 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500">
        {password.length < 8 && "At least 8 characters recommended"}
      </div>
    </div>
  );
}

export default function ForgetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState<any>("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
          }),
        });

        if (res.status === 400) {
          setError("Token is invalid or has expired.");
          setVerified(true);
        }

        if (res.status === 200) {
          setError("");
          setVerified(true);
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    verifyToken();
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          email: user?.email,
        }),
      });

      if (res.status === 400) {
        setError("Något gick fel. Försök igen.");
      }

      if (res.status === 200) {
        setError("");
        router.push("/sign-in");
      }
    } catch (error) {
      setError("Något gick fel. Försök igen.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter a new password below to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                placeholder=""
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <p className="text-red-600 text-sm">
                  {error}
                </p>
              )}

              <PasswordStrengthIndicator password={password} />
            </div>

            <div className="flex flex-col gap-2">
              <Button
                disabled={error.length > 0 || !verified || loading}
                type="submit"
                className="w-full"
              >
                {loading ? "Resetting Password..." : "Reset your Password"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
