import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "If the email exists, a reset link has been sent." },
        { status: 200 }
      );
    }

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: existingUser.id,
      },
    });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId: existingUser.id,
        expiresAt: new Date(Date.now() + 3600000), 
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    console.log("Password reset URL:", resetUrl);

    return NextResponse.json(
      { message: "If the email exists, a reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}
