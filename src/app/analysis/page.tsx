"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";



export default function GeminiChat() {

  const [progressBars, setProgressBars] = useState<{name: string; percentage: number}[]>([]);
  const [selectedGoal,setSelectedGoal] = useState("");

  useEffect(() =>  {
      const fetchData = async () => {
          try {

            const userResponse = await fetch("/api/getCurrentUser");
            const userData = await userResponse.json();
            const email = userData.user?.email;
            console.log(email);

            const res = await fetch(`/api/getKnownProgesses?email=${email}`);

            if (!res.ok) {
                console.error("API request failed:", res.status, res.statusText);
                return;
            }

            const data = await res.json(); // No need for JSON.parse()

            if (data && Array.isArray(data.goals)) {
                const progressData = data.goals.map((goal: { goal: string; globalTimeSpent: number; HowMuchTime: number }) => ({
                    name: goal.goal || "Untitled Goal",
                    percentage: goal.HowMuchTime > 0 ? (goal.globalTimeSpent / goal.HowMuchTime) * 100 : 0,
                }));

                setProgressBars(progressData);
            } else {
                console.warn("Unexpected API response:", data);
            }
        } catch (error) {
            console.error("Failed to fetch user goals:", error);
        }
    }

    fetchData();
  }, []);
   
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    setChatHistory((prev) => [...prev, { role: "user", text: input }]);
    const userResponse = await fetch("/api/getCurrentUser");
    const userData = await userResponse.json();
    const currentUser = userData.user?.email;

    if(!currentUser){ console.error("user Not logged in."); return;}

    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input, currentEmail: currentUser,goal: selectedGoal,chatHistory}),
    });

    const data = await res.json();
    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    setChatHistory((prev) => [...prev, { role: "assistant", text: aiResponse }]);

    console.log("Before clearing:", input);
    setInput("");
    console.log("After clearing:", input);

    setSelectedGoal("");
  };

  const handleGoalClick = (index: number, name: string) => {
    console.log(`Clicked on goal ${index}: ${name}`);
    setSelectedGoal(name);
    // Handle goal selection here (e.g., open details, mark progress, etc.)
  };
  

  return (
    <div className="bg-black flex flex-col w-full min-h-screen items-center">
        {/* 🔹 Navbar Fixed at Top */}
        <div className="flex flex-col">
        <div className="w-full h-[50px] border-2 shadow-white shadow-lg border-black flex items-center gap-5 rounded-xl">
                    <Link href="/" className="w-[120px] h-full text-2xl font-bold text-gray-400 flex items-center justify-center">
                        AWAKE
                    </Link>        
                    <Link href="/home" className="w-[90px] h-full ml-auto font-bold text-gray-400 flex items-center justify-center">
                        Home
                    </Link>
                    <Link href="/analysis" className="w-[90px] h-full font-bold text-gray-400 flex items-center justify-center">
                        Analyze
                    </Link>
                    <Link href="/landin" className="w-[90px] h-full font-bold text-gray-400 flex items-center justify-center">
                        Clan
                    </Link>
                </div>


          {/* 🔹 Scrollable Chat History */}
          
          <div className="mt-[60px] w-[1200px] h-[calc(100vh-140px)] rounded-xl shadow-white overflow-y-auto border-2 border-black text-white p-4">
          {chatHistory.map((message, index) => (
              <div
              key={index}
              className={`p-2 my-2 rounded-lg ${
                message.role === "user"
                  ? "bg-gray-900 rounded-xl w-fit h-fit text-right whitespace-pre-line rounded-xl"
                  : "bg-[#1A1A1A] border-white text-start whitespace-pre-line rounde-2 rounded-[30px] shadow-white text-white"
              }`}
            >
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          ))}
          <div className="w-full h-[80px] border-2 border-black"></div>
          </div>


          {/* 🔹 Fixed Input Box at Bottom */}
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-black w-[1000px] bg-[#030303] border-2 border-black rounded-xl flex items-center shadow-lg z-50 p-2">
            <div className="relative w-full">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault(); // Prevents new line
                            handleSubmit(e); // Pass event to handleSubmit
                        }
                    }}
                    className="p-4 rounded-xl text-white bg-[#1C1C1D] w-full min-h-[100px] max-h-[200px] outline-none pr-14 resize-none overflow-y-auto"
                    placeholder="Ask Rigel..."
                />
                <button 
                    onClick={(e) => handleSubmit(e)}  // Pass event here too
                    className="absolute bottom-4 right-4 text-white px-4 py-2 rounded"
                >
                    <img src="/sent.svg" alt="SVG Icon" className="w-8 h-8 text-green-500" />
                </button>
            </div>
        </div>



        <div className="fixed bottom-4 right-[5%] transform translate-x-0 text-black w-[300px] bg-transparent border-2 border-black rounded-xl flex items-center shadow-lg z-50 p-2">
          <div className="rounded-xl text-white bg-transparent w-full min-h-[100px] max-h-[200px] outline-none pr-14 resize-none overflow-y-auto">
            <div 
              onClick={() => setIsExpanded((prev) => !prev)} 
              className="cursor-pointer w-full h-[60px] flex rounded-xl border-2 border-white items-center justify-start px-4 shadow-lg"
            >
              <h1 className="text-2xl font-bold">Current Goals.</h1>
            </div>

            {isExpanded && (
              <div className="flex">
                <div className="w-full flex flex-col h-auto border-2 border-white m-2 rounded-xl overflow-hidden">
                  {progressBars.map((bar, index) => (
                    <div
                      key={index}
                      className="w-full flex justify-between items-center h-[40px] border-2 border-black m-2 rounded-xl cursor-pointer transition duration-200 hover:bg-gray-900 hover:text-white"
                      onClick={() => handleGoalClick(index, bar.name)}
                    >
                      {bar.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

          </div>
        </div>

  );
}
