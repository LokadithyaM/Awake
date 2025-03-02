import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { currentEmail, goal, HowMuchTime } = body;

        console.error(goal,"");

        if (!currentEmail || !goal || !HowMuchTime) {
            return NextResponse.json({ message: "Missing email, goal, or the time that you are willing to take!" }, { status: 400 });
        }

        const db = await connectToDatabase();
        const progressCollection = db.collection("progress");

        const existingProgress = await progressCollection.findOne({ email: currentEmail });

        if (existingProgress) {
            const goalExists = existingProgress.currentTasks.some((task: { goal: string }) => task.goal === goal);
            if (goalExists) {
                return NextResponse.json({ message: "Goal already exists!" }, { status: 400 });
            }

            await progressCollection.updateOne(
                { email: currentEmail },
                { 
                    $push: { currentTasks: { goal, globalTimeSpent: 0, HowMuchTime, entries: [] } }
                }
            );
        } else {
            await progressCollection.insertOne({
                email: currentEmail,
                currentTasks: [{ goal, globalTimeSpent: 0, HowMuchTime, entries: [] }]
            });
        }

        return NextResponse.json({ message: "Goal created!" }, { status: 201 });
    } catch (error) {
        console.error("Error creating goal:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
