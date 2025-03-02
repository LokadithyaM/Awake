"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Correct import

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!email || !password) {
      setError("Email and password are required!");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("Sign-up Successful!");
      router.push("/login");
    } else {
      setError(data.message);
    }
  }

  return (
    <div className="flex flex-col bg-black items-center justify-center min-h-screen">
    <div className="shadow-white shadow-lg w-[1500px] min-h-screen border-2 border-black text-black p-5 flex flex-col items-center">
      
      {/* Title Section */}
      <h1 className="text-[50px] text-transparent bg-clip-text bg-gradient-to-b from-gray-500 to-gray-900 font-semibold text-center mb-5">
        Well we hope you are signing up for a good reason.
      </h1>
  
      {/* Description Section */}
      <p className="text-2xl text-start text-gray-300 pb-6 w-[80%]">
        At our core, we empower you to stay focused on what truly matters. 
        Every time you open an app, we prompt you to reflect: 
        <span className="italic">"How does this align with my goals?"</span> 
        Rather than simply eliminating distractions, we help you cultivate 
        intentionality in every interaction. Your device should be more than just 
        a tool—it should support your growth. With each app you use, you take a 
        step closer to your aspirations, ensuring that technology serves your 
        purpose rather than pulling you away from it.
      </p>
  
      {/* Signup and Awake Side-by-Side Section */}
      <div className="flex flex-row items-center bg-transparent justify-between w-[1300px] mt-5 p-4">
      
        <div className="border-white text-[200px] font-bold text-gray-500 px-10 py-4">
          Awake
        </div>

        <div className="w-[500px] h-[500px] border-2 border-black bg-transparent flex flex-col items-center justify-center rounded-xl p-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-500 mb-6">
            Signup
          </h1>
  
          {/* Email Input */}
          <div className="flex items-center w-full mb-4">
            <h1 className="pr-2 text-2xl text-white">Email:</h1>
            <input
              type="email"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded text-2xl text-black w-full"
              required
            />
          </div>
  
          {/* Signup Button */}
          <button
            onClick={handleSignup}
            className="w-[200px] h-12 bg-green-700 text-white font-bold rounded-full hover:bg-green-800 transition duration-200"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
  
          {/* Error Message */}
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </div>
      </div>
    </div>
  </div>  
  );
}
