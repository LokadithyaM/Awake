import { Server } from "socket.io";
import { connectToDatabase } from "@/app/lib/mongodb";

const ioHandler = async (req: any, res: any) => {
  if (!res.socket.server.io) {
    console.log("Starting WebSocket server...");
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("sendMessage", async (data) => {
        const { sender, recipient, message, timestamp } = data;
        console.log("Received:", data);

        // Store message in MongoDB
        try {
          const db = await connectToDatabase();
          const users = db.collection("users");

          const safeSender = sender.replace(/[@.]/g, "_");
          const safeRecipient = recipient.replace(/[@.]/g, "_");

          const chatKey = `${safeSender}#${safeRecipient}`;

          await users.updateOne(
            { email: sender },
            { $push: { [`chats.${chatKey}`]: { recipient, message, timestamp } } }
          );

          await users.updateOne(
            { email: recipient },
            { $push: { [`chats.${chatKey}`]: { sender, message, timestamp } } }
          );

          // Emit message to recipient
          io.to(recipient).emit("receiveMessage", data);
        } catch (error) {
          console.error("Error storing message:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
