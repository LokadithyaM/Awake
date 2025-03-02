import { getIronSession, SessionOptions } from "iron-session";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/app/lib/mongodb";
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

export async function GET() {
  try {
    const session = await getIronSession<UserSession>(await cookies(), sessionOptions);

    if (!session.userId) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const db = await connectToDatabase();
    const users = db.collection("users");

    // Fetch user details using email
    const user = await users.findOne({ email: session.userId }, { projection: { _id: 1, email: 1, name: 1 } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.error(user.email,"");

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error("GetUser error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
