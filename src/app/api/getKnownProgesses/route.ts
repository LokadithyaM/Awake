import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");


        if (!email) {
            return NextResponse.json({ message: "Email is required!" }, { status: 400 });
        }

        const db = await connectToDatabase();
        const progressCollection = db.collection("progress");

        const userProgress = await progressCollection.findOne({ email });


        if (!userProgress) {
            return NextResponse.json({ goals: [] }, { status: 200 });
        }
        
        

        return NextResponse.json({ goals: userProgress.currentTasks }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user progress:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
