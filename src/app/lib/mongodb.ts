import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const options = {};

if (!uri) {
  throw new Error("❌ MONGODB_URI is not defined! Check your .env file.");
}

// Declare a cached variable to preserve connections in development
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  return client.db(); // Returns MongoDB database instance
}
