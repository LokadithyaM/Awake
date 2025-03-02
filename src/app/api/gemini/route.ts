import { connectToDatabase } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, currentEmail, goal, chatHistory } = await req.json(); // Accept chatHistory from frontend

    let enrichedPrompt = `User: ${prompt}`; // Default message when no goal

    if (goal) {
      const db = await connectToDatabase();
      const userContext = db.collection("progress");
      const currentUser = await userContext.findOne({ email: currentEmail });

      if (!currentUser) {
        return NextResponse.json({ message: "User not found!" }, { status: 404 });
      }

      const specificGoal = currentUser.currentTasks.find(
        (task: { goal: string }) => task.goal.toLowerCase() === goal.toLowerCase()
      );

      enrichedPrompt = `
        You are a personalized productivity assistant.
        The user is working on: "${specificGoal.goal}".
        Time Spent: ${specificGoal.globalTimeSpent} hours.
        Progress Entries:
        ${specificGoal.entries
          .map((e: { message: any; timestamp: any }) => `- "${e.message}" at ${e.timestamp}`)
          .join("\n")}
        
        Conversation so far:
        ${chatHistory
          .map((msg: { role: string; text: string }) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.text}`)
          .join("\n")}
        
        Now, the user asked: "${prompt}".
        Respond considering their progress and chat history.
      `;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: enrichedPrompt }] }] }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
