import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const user = await db.collection("users").findOne(
      { email },
      { projection: { chats: 1, _id: 0 } } // Fetch only chats
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.chats);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}