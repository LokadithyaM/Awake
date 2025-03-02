import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { currentEmail, newUserEmail, name } = body;

        if (!currentEmail || !newUserEmail) {
            return NextResponse.json({ message: "Both emails are required!" }, { status: 400 });
        }

        const db = await connectToDatabase();
        const users = db.collection("users");

        // Check if the new user exists
        const newUser = await users.findOne({ email: newUserEmail });
        if (!newUser) {
            return NextResponse.json({ message: "User does not exist!" }, { status: 404 });
        }

        // Get current user's name
        const currentUser = await users.findOne({ email: currentEmail }, { projection: { name: 1 } });
        const currentUserName = currentUser?.name || "Unknown";

        // Update or add known user, ensuring no duplicate emails
        await users.updateOne(
            { email: currentEmail, "knownUsers.email": newUserEmail },
            { $set: { "knownUsers.$.name": name } }
        );
        await users.updateOne(
            { email: currentEmail, "knownUsers.email": { $ne: newUserEmail } },
            { $push: { knownUsers: { email: newUserEmail, name } } }
        );

        await users.updateOne(
            { email: newUserEmail, "knownUsers.email": currentEmail },
            { $set: { "knownUsers.$.name": currentUserName } }
        );
        await users.updateOne(
            { email: newUserEmail, "knownUsers.email": { $ne: currentEmail } },
            { $push: { knownUsers: { email: currentEmail, name: currentUserName } } }
        );

        // Ensure chat initialization
        const chatKey = `${currentEmail}#${newUserEmail}`;
        await users.updateOne(
            { email: currentEmail },
            { $set: { [`chats.${chatKey}`]: [] } }
        );
        await users.updateOne(
            { email: newUserEmail },
            { $set: { [`chats.${chatKey}`]: [] } }
        );

        return NextResponse.json({ message: "Known user added successfully!" }, { status: 200 });

    } catch (error) {
        console.error("Error adding known user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

