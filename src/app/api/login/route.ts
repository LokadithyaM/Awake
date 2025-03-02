import { getIronSession, SessionOptions } from "iron-session";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import { UserSession } from "@/app/lib/session";

const sessionOptions: SessionOptions = {
  cookieName: "user_session",
  password: process.env.SESSION_SECRET || "a_secure_random_password",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 6 * 60 * 60, // 6 hours
  },
};

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required!" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ message: "User does not exist!" }, { status: 400 });
    }

    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid credentials!" }, { status: 400 });
    }

    // **Fix: Await cookies()**
    const session = await getIronSession<UserSession>(await cookies(), sessionOptions);

    // **Fix: Use user object**
    session.userId = existingUser.email;
    await session.save();

    return NextResponse.json({ message: "Login successful!", user: session.userId }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
