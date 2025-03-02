"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/info"); // Redirect after login
    } else {
      console.error("Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center bg-black justify-center min-h-screen">
      <div className="flex flex-row items-center bg-transparent justify-between w-[1300px] mt-5 p-4">
        <div className="border-white text-[200px] font-bold text-gray-500 px-10 py-4">
          Awake
        </div>

        <div className="w-[500px] h-[500px] border-2 border-black bg-transparent flex flex-col items-center justify-center rounded-xl p-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-green-500 mb-6">
            Login
          </h1>

          {/* Email Input */}
          <div className="flex items-center w-full mb-4">
            <h1 className="pr-2 text-2xl text-white">Email:</h1>
            <input
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="border p-2 rounded text-2xl text-black w-full"
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center w-full mb-6">
            <h1 className="p-4 text-2xl text-white ">Key:</h1>
            <input
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="border p-2 rounded  text-2xl text-black w-full"
              required
            />
          </div>

          <button className="w-[200px] h-12 bg-green-700 text-white font-bold rounded-full hover:bg-green-800 transition duration-200" onClick={handleLogin}>Login</button>
      </div>
    </div>
  </div>

  );
}
