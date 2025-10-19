import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { password, email } = await request.json();

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
        { message: "Email does not exist." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: existingUser.id,
      },
    });

    const doesUserHavePassword = await prisma.password.findUnique({
      where: {
        userId: existingUser.id,
      },
    });

    if (!doesUserHavePassword) {
      await prisma.password.create({
        data: {
          userId: existingUser.id,
          passwordHash: hashedPassword,
        },
      });
    } else {
      await prisma.password.update({
        where: {
          userId: existingUser.id,
        },
        data: {
          passwordHash: hashedPassword,
        },
      });
    }

    return NextResponse.json(
      { message: "Password has been reset." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}