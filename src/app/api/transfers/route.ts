import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { sender, recipient, message, timestamp } = await req.json();
    console.error("recived:",sender,recipient,message,timestamp);

    // console.log("",senderEmail);

    if (!sender || !recipient || !message) {
      return NextResponse.json({ message: "All fields are required!" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const users = db.collection("users");

    // Check if receiver exists
    const receiver = await users.findOne({ email: recipient });
    if (!receiver) {
      return NextResponse.json({ message: "Receiver not found!" }, { status: 404 });
    }

    const messageData = { sender: sender, recipient: recipient, message, timestamp };
    const safeSender = sender.replace(/[@.]/g, "_");
    const safeRecipient = recipient.replace(/[@.]/g, "_");

    const chatKey = `${safeSender}#${safeRecipient}`;
    const reverseChatKey = `${safeRecipient}#${safeSender}`;

    // // Update both sender's and receiver's chat records
    await db.collection("users").updateOne(
      { email: sender },
        {
            $push: {
                [`chats.${chatKey}`]: { recipient, message, timestamp }
            }
        }
    );

    await db.collection("users").updateOne(
      { email: recipient },
        {
            $push: {
                [`chats.${chatKey}`]: { sender, message, timestamp }
            }
        }
    );

    return NextResponse.json({ message: "Message sent successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Message sending error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
