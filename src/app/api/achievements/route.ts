import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { currentEmail, goal } = body;

        const db = await connectToDatabase();
        const progressCollection = db.collection("progress");
        const achievementsCollection = db.collection("achievements");

        // Find the user's progress document
        const userProgress = await progressCollection.findOne({ email: currentEmail });

        if (!userProgress) {
            return NextResponse.json({ message: "User progress not found" }, { status: 404 });
        }

        // Find the goal in currentTasks
        const taskIndex = userProgress.currentTasks.findIndex((task: { goal: string }) => task.goal === goal);

        if (taskIndex === -1) {
            return NextResponse.json({ message: "Goal not found in progress" }, { status: 404 });
        }

        // Extract the goal details
        const completedGoal = userProgress.currentTasks[taskIndex];

        // Remove the goal from currentTasks
        await progressCollection.updateOne(
            { email: currentEmail },
            { $pull: { currentTasks: { goal: goal } } }
        );

        // Add the goal to achievements
        await achievementsCollection.updateOne(
            { email: currentEmail },
            { $push: { achievements: completedGoal } },
            { upsert: true }
        );

        return NextResponse.json({ message: "Goal added to achievements!" }, { status: 200 });
    } catch (error) {
        console.error("Error updating goal:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
