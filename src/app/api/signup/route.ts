import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required!" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists!" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await users.insertOne({ email, password: hashedPassword, knownUsers: [], chats: {}});

    return NextResponse.json({ message: "User registered successfully!", userId: newUser.insertedId }, { status: 201 });

  } catch (error) {
    console.error("Sign-up error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
