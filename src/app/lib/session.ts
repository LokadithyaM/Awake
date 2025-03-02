import { SessionOptions } from "iron-session";

export type UserSession = {
  userId: string;
};

export const sessionOptions: SessionOptions = {
  cookieName: "user_session",
  password: process.env.SESSION_SECRET || "your-very-long-secure-password-32-chars-min", // Use a strong secret
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // Secure cookies in production
    maxAge: 6 * 60 * 60, // 6 hours
  },
};
