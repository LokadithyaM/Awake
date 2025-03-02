"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    return (
        <div className="min-h-screen w-full bg-black border-2 border-black flex items-center justify-center gap-2">
            <div className="w-[1300px] h-[1300px] border-2 border-black flex flex-col items-center gap-2 p-2">
                {/* Header Section */}
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



                <div className="w-full h-full flex flex-col gap-4 p-4">
                    <div className="w-full flex h-[70px] border-2 border-black p-4 rounded-xl justify-start gap-4">
                        <div className="flex text-gray-700 justify-center items-center text-center font-bold text-[50px]">
                            Welcome to Awake!
                        </div>
    

                    </div>

    
                    <div className="w-full flex h-full border-2 border-black p-4 rounded-xl gap-4 flex-col">
                        <div className="text-xl font-bold text-center">Core Features</div>
    
                        <div className="flex flex-col gap-2">
                            {/* Messaging Feature */}
                            <div className="border border-black p-3 rounded-lg">
                                <div className="font-bold">📩 Minimalistic Messaging</div>
                                <p className="text-xl">
                                    A no-distraction, mail-style messaging system. New messages don’t appear instantly— 
                                    we embrace minimalism. Add as many users as needed, with all data stored locally. 
                                    No third-party APIs ensure complete privacy. Messages are only available on deliberate 
                                    refresh to prevent unnecessary time wastage.
                                </p>
                            </div>

                            {/* Home & Goal Tracking Feature */}
                            <div className="border border-black p-3 rounded-lg">
                                <div className="font-bold">📌 Goal Tracking</div>
                                <p className="text-xl">
                                    Structure your progress by setting and tracking goals. Record descriptions, 
                                    daily experiences, and time spent on each goal. Every detail is crunched and 
                                    summarized to keep you focused.
                                </p>
                            </div>

                            {/* Analysis & Chatbot Feature */}
                            <div className="border border-black p-3 rounded-lg">
                                <div className="font-bold">🤖 AI-Powered Analysis</div>
                                <p className="text-xl">
                                    Powered by Gemini, our chatbot helps analyze past recordings, providing insights 
                                    on improvement areas. Select goals from your current list and get detailed feedback. 
                                    Ask general questions as well.
                                </p>
                            </div>
                        </div>

                        <div className="text-center text-green-900 shadow-green-900 shadow-lg text-[30px] font-semibold mt-4">
                            Discipline. Consistency. Connection.
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
