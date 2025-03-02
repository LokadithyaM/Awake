import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { currentEmail, goal, timeSpent, message, description } = body;

        if (!currentEmail || !goal || timeSpent === undefined || !message || !description) {
            return NextResponse.json({ message: "Missing required fields!" }, { status: 400 });
        }

        const db = await connectToDatabase();
        const progressCollection = db.collection("progress");

        const timeSpentHours = timeSpent;

        const userProgress = await progressCollection.findOne({ email: currentEmail });

        if (!userProgress) {
            return NextResponse.json({ message: "User progress not found!" }, { status: 404 });
        }

        const goalIndex = userProgress.currentTasks.findIndex((task: { goal: any; }) => task.goal === goal);

        if (goalIndex === -1) {
            return NextResponse.json({ message: "Goal not found!" }, { status: 404 });
        }

        // Goal exists → Update time and add new entry
        const existingGoal = userProgress.currentTasks[goalIndex];
        const updatedGlobalTime = existingGoal.globalTimeSpent + timeSpentHours;

        await progressCollection.updateOne(
            { email: currentEmail, "currentTasks.goal": goal },
            { 
                $push: { 
                    "currentTasks.$.entries": { 
                        timeSpent: `${timeSpentHours}h`, 
                        message, 
                        description 
                    } 
                },
                $set: { "currentTasks.$.globalTimeSpent": `${updatedGlobalTime}` }
            }
        );

        return NextResponse.json({ message: "Progress updated!" }, { status: 200 });
    } catch (error) {
        console.error("Error updating progress:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
