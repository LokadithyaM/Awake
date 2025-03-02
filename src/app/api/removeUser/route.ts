import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { currentEmail, removeUser } = body;

        if (!currentEmail || !removeUser) {
            return NextResponse.json({ message: "Email is required!" }, { status: 400 });
        }

        const db = await connectToDatabase();
        const usersCollection = db.collection("users");

        const currentUser = await usersCollection.findOne({ email: currentEmail });

        if (!currentUser) {
            return NextResponse.json({ message: "User not found!" }, { status: 404 });
        }


        const result = await usersCollection.updateOne(
            { email: currentEmail },
            { $pull: { knownUsers: { email: removeUser } } }
        );

        // if (result.modifiedCount === 0) {
        //     return NextResponse.json({ message: "User not found in knownUsers!" }, { status: 404 });
        // }

        return NextResponse.json({ message: "Contact removed successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error fetching known users:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
