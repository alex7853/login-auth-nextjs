import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ message: "Ogiltig token." }, { status: 400 });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const existingToken = await prisma.passwordResetToken.findUnique({
      where: {
        token: hashedToken,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        userId: true,
      },
    });

    if (!existingToken) {
      return NextResponse.json(
        { message: "Token är ogiltig eller har utgått." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: existingToken.userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Användaren hittades inte." },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { message: "Ett serverfel uppstod." },
      { status: 500 }
    );
  }
}
