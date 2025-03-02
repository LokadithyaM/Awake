import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { currentEmail, goal, SubTime, description, message } = body;

        const db = await connectToDatabase();
        const progressCollection = db.collection("progress");

        // Find the user's progress document
        const userProgress = await progressCollection.findOne({ email: currentEmail });

        if (!userProgress) {
            return NextResponse.json({ message: "User progress not found" }, { status: 404 });
        }

        // Check if the goal exists in currentTasks
        const taskIndex = userProgress.currentTasks.findIndex((task: { goal: string }) => task.goal === goal);

        if (taskIndex === -1) {
            return NextResponse.json({ message: "Goal not found" }, { status: 404 });
        }

        // Update the goal's entries and globalTimeSpent
        const updatedTask = { ...userProgress.currentTasks[taskIndex] };
        updatedTask.entries.push({ SubTime, message, description, timestamp: new Date() });
        updatedTask.globalTimeSpent = (parseInt(updatedTask.globalTimeSpent, 10) || 0) + parseInt(SubTime, 10);

        // Update the database
        await progressCollection.updateOne(
            { email: currentEmail, "currentTasks.goal": goal },
            {
                $set: {
                    "currentTasks.$.entries": updatedTask.entries,
                    "currentTasks.$.globalTimeSpent": updatedTask.globalTimeSpent
                }
            }
        );

        const totalTimeRequired = parseInt(updatedTask.HowMuchTime, 10) || 1; // Prevent division by zero
        const percentageCompleted = Math.min(
            (updatedTask.globalTimeSpent / totalTimeRequired) * 100,
            100
        ); 

        return NextResponse.json({ message: "Goal Updated!",  percentageCompleted: percentageCompleted.toFixed(2)  }, { status: 200 });
    } catch (error) {
        console.error("Error updating goal:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
