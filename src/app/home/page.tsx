"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { format, startOfWeek, addDays, subDays, isSameDay } from "date-fns";

export default function Page() {
    const [userEmail, setUserEmail] = useState<string | null>(null);

    

    // const sampleData = [
    //     { date: "2024-02-01", count: 5 },
    //     { date: "2024-02-10", count: 12 },
    //     { date: "2024-03-02", count: 8 },
    //     { date: "2024-03-05", count: 20 },
    // ];

    // const sampleTask = [
    //     {time: 5, learnt: "I larnt how to solve best time to sell stocks",experience: "it felt tough but not impossible"},
    // ];

    
    useEffect(() => {
        async function fetchUserEmail() {
            try {
                const res = await fetch("/api/getCurrentUser");
                const data = await res.json();
                if (data.user?.email) {
                    setUserEmail(data.user.email);
                    fetchUserGoals(data.user.email);
                }
            } catch (error) {
                console.error("Failed to fetch user email", error);
            }
        }

        async function fetchUserGoals(email: string) {
            try {
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

        fetchUserEmail();
    }, []);

    const CalendarHeatmap: React.FC<{ data: { date: string; count: number }[] }> = ({ data }) => {
        const heatmapColors = ["#111827", "#374151", "#6B7280", "#D1D5DB", "#FFFFFF"];
    
        const getColor = (count: number) => {
            if (count >= 15) return heatmapColors[4];
            if (count >= 10) return heatmapColors[3];
            if (count >= 5) return heatmapColors[2];
            if (count >= 1) return heatmapColors[1];
            return heatmapColors[0];
        };
    
        const generateDateArray = (startDate: Date, endDate: Date) => {
            let dates = [];
            let currentDate = startDate;
            while (currentDate <= endDate) {
                dates.push(currentDate);
                currentDate = addDays(currentDate, 1);
            }
            return dates;
        };
    
        const today = new Date();
        const startDate = subDays(today, 365); // Past 1 year
        const endDate = today;
        const allDates = generateDateArray(startDate, endDate);
    
        return (
            <div className="flex flex-col mt-[80px]">
                <div className="w-full h-[60px] flex rounded-xl border-2 border-black items-center justify-between px-4 mb-2">
                        <h1 className="text-1xl font-bold text-gray-400">Total Completions:</h1>
                        <h2 className="text-1xl font bold text-gray-400 mr-2">current Streak:</h2>
                </div>
                <div className="flex gap-1 m-2">
                    {[...Array(52)].map((_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {[...Array(7)].map((_, dayIndex) => {
                                const date = addDays(startOfWeek(startDate), weekIndex * 7 + dayIndex);
                                const activity = data.find(d => isSameDay(new Date(d.date), date));
                                return (
                                    <div
                                        key={dayIndex}
                                        title={`${format(date, "yyyy-MM-dd")}: ${activity ? activity.count : 0} contributions`}
                                        className="w-5 h-5 rounded-sm"
                                        style={{
                                            backgroundColor: getColor(activity ? activity.count : 0),
                                        }}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    type DayRecordProps = {
        timeSpent: string;
        setTimeSpent: (value: string) => void;
        description: string;
        setDescription: (value: string) => void;
        experience: string;
        setExperience: (value: string) => void;
    };
    

    const CircularProgressBar = ({ name, percentage }: { name: string; percentage: number }) => {
        const radius = 45;
        const strokeWidth = 3;
        const circumference = 2 * Math.PI * radius;
        const [updatedPercentage, setUpdatedPercentage] = useState<number>(percentage);
        const offset = circumference - (updatedPercentage / 100) * circumference;
        const [isExpanded, setIsExpanded] = useState(true);
    
        // State for form inputs
        const [timeSpent, setTimeSpent] = useState("");
        const [description, setDescription] = useState("");
        const [experience, setExperience] = useState("");
    
        const handlePost = async () => {
            if (!timeSpent || !description || !experience) {
                console.error("All three fields are mandatory!");
                return;
            }
        
            try {
                const response = await fetch("/api/updateKnownProgress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        currentEmail: userEmail, 
                        goal: name,  
                        SubTime: timeSpent,  
                        message: experience,  
                        description: description, 
                    }),
                });
        
                const data = await response.json();
                if (response.ok) {
                    console.log("Goal updated successfully:", data.message);
        
                    // Round to nearest integer
                    const newPercentage = Math.round(parseFloat(data.percentageCompleted));
        
                    setUpdatedPercentage(newPercentage);
        
                    // If percentage crosses 100, move to achievements
                    if (newPercentage >= 100) {
                        moveToAchievements(name);
                    }

                    setTimeSpent("");
                    setDescription("");
                    setExperience("");

                } else {
                    console.error("Error updating goal:", data.message);
                }
            } catch (error) {
                console.error("Failed to update progress:", error);
            }
        };
        
        // Function to move task to achievements
        const moveToAchievements = async (goalName: string) => {
            console.log(`Goal "${goalName}" completed! Moving to achievements...`);
        
            try {
                const response = await fetch("/api/achievements", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        currentEmail: userEmail, // Ensure `userEmail` is defined
                        goal: goalName
                    }),
                });
        
                const data = await response.json();
        
                if (response.ok) {
                    console.log("Goal successfully moved to achievements:", data.message);
                    window.location.reload();
                } else {
                    console.error("Failed to move goal:", data.message);
                }
            } catch (error) {
                console.error("Error moving goal to achievements:", error);
            }
        };
        
        
    
        return (
            <div className="flex flex-col border-2 border-white rounded-xl mb-[50px]">
                <div 
                    onClick={() => setIsExpanded((prev) => !prev)} 
                    className="cursor-pointer w-full h-[60px] flex rounded-xl border-2 border-white items-center justify-start px-4 shadow-white shadow-lg"
                >
                    <h1 className="text-2xl font-bold text-white">{name}</h1>
                </div>
    
                {isExpanded && (
                    <div className="flex">
                        <svg viewBox="0 0 100 100" className="w-[300px] h-auto">
                            <circle cx="50" cy="50" r={radius} fill="transparent" className="stroke-gray-900" strokeWidth={strokeWidth} />
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="transparent"
                                className="stroke-gray-300 transition-all duration-500"
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                transform="rotate(90 50 50)"
                            />
                            <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-white">
                                {Math.round(updatedPercentage)}%
                            </text>
                        </svg>
    
                        <div className="w-[1000px] flex flex-col min-h-[300px] h-auto border-2 border-white m-2 rounded-xl overflow-hidden">
                            <div className="w-full flex justify-between h-[50px] border-2 border-black m-2 rounded-xl">
                                <div className="w-[200px] h-full border-2 border-black rounded-xl text-2xl font-semibold text-center">
                                    Today's work
                                </div>
                                <button 
                                    className="w-[100px] h-full border-2 border-white rounded-xl mr-[20px] text-2xl font-semibold text-center"
                                    onClick={handlePost}
                                >
                                    Post
                                </button>
                            </div>
    
                            <DayRecord 
                                timeSpent={timeSpent} setTimeSpent={setTimeSpent} 
                                description={description} setDescription={setDescription} 
                                experience={experience} setExperience={setExperience} 
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    };
    
    const DayRecord: React.FC<DayRecordProps> = ({ timeSpent, setTimeSpent, description, setDescription, experience, setExperience }) => {
        return (
            <div className="w-full h-full border-2 border-white text-white p-4 flex flex-col gap-4">
                <div className="w-full min-h-[50px] border-2 border-white p-2 flex items-center">
                    <span className="mr-2 text-white">Time Spent (hours):</span>
                    <input 
                        type="number"
                        value={timeSpent}
                        onChange={(e) => setTimeSpent(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-white text-lg"
                    />
                </div>
    
                <div className="w-full border-2 border-white p-2">
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full min-h-[50px] h-auto bg-transparent border-none outline-none text-white resize-none overflow-hidden"
                        placeholder="Enter description..."
                    />
                </div>
    
                <div className="w-full border-2 border-white p-2">
                    <textarea
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full min-h-[50px] h-auto bg-transparent border-none outline-none text-white resize-none overflow-hidden"
                        placeholder="Enter experience..."
                    />
                </div>
            </div>
        );
    };
    

    const [progressBars, setProgressBars] = useState<{name: string; percentage: number}[]>([]);
    const [goalName, setGoalName] = useState("");
    const [time, setTime] = useState("");

    const newProgress = {
        email: userEmail, // Replace with the actual email from your app's state/context
        name: goalName,
        time: time,
    };

    const addProgressBar = async (goalName: string, time: number) => {
        if (!goalName || !time) {
            alert("Please enter both goal name and time!");
            return;
        }
    
        const newProgressBar = {
            name: goalName,
            percentage: 0,
            time: time, // Store the time if needed
        };
    
        setProgressBars([...progressBars, newProgressBar]);

        try {

            // console.error(userEmail,"");
            const response = await fetch("/api/progress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentEmail: userEmail,
                    goal: goalName,
                    HowMuchTime: time,
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "Failed to create goal.");
            }

            setGoalName("");
    setTime("");
    
            console.log("Goal successfully created:", data.message);
        } catch (error) {
            console.error("Error adding progress:", error);
        }
    };
    
    

    return (
        <div className="min-h-screen w-full bg-black border-2 border-black flex items-center justify-center">
            <div className="w-[1300px] h-auto border-2 border-black flex flex-col items-center gap-2 p-2">
                
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

                {/* Main Content Section */}
                <div className="w-full flex h-[400px] border-2 border-black p-2 rounded-xl gap-2">
                    
                    {/* Profile Section */}
                    <div className="w-1/3 h-full border-2 border-black rounded-xl relative bg-black overflow-hidden">
                        {/* Image covering the entire container */}
                        <img src="/eye 1.svg" alt="Logo" className="absolute top-[10px] left-0 w-full h-full object-fill" />

                        {/* Name card positioned above the image */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[80%] h-[60px] flex items-center justify-center rounded shadow-white shadow-md">
                            <h1 className="text-4xl font-bold text-gray-400 tracking-wide">Dreamer_147</h1>
                        </div>

                    </div>


                    {/* Daily Tasks Section */}
                    <div className="w-2/3 h-full border-2 border-black rounded-xl flex items-center justify-center ">
                        <h1 className="text-3xl justify-start text-center font-bold text-gray-600">It’s not about reaching the destination;<br/>it’s about becoming the person who naturally arrives there.</h1>
                    </div>
                </div>

                {/* Long-Term Goals Section */}
                <div className="w-full flex flex-col h-auto border-2 border-black m-2 p-2 rounded-xl gap-2">
                    {/* <div className="w-full h-[180px] flex justify-center items-center mb-[100px]">
                        <CalendarHeatmap data={sampleData} />
                    </div> */}
                    <div className="w-full h-[60px] flex rounded-xl border-2 border-black items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-400 border-2 border-gray-900 rounded-xl p-2">Currently Working With</h1>
                        </div>
                    </div>

                    <div className="cursor-pointer w-full h-[60px] flex rounded-xl border-2 border-white items-center justify-between px-4 shadow-white shadow-lg mb-[50px]">
                    <input 
                        type="text"
                        placeholder="Goal name here"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                        className="text-2xl font-bold text-white bg-transparent border-none outline-none w-[250px]"
                    />

                    {/* Time Input (in Hours) */}
                    <input 
                        type="number"
                        placeholder="Time !"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="text-2xl font-bold text-white bg-transparent border-none outline-none w-[100px] text-center"
                    />
                       <button onClick={() => addProgressBar(goalName, parseInt(time))} 
                            className="hover:bg-gray-900 w-[100px] border-2 border-white h-[40px] rounded-xl mr-[20px] text-2xl font-semibold text-center justify-center shadow-white shadow-lg">
                            add
                        </button>

                    </div>

                    {progressBars.map((bar, index)=>(
                        <CircularProgressBar key = {index} name = {bar.name} percentage={bar.percentage}/>
                    ))}
                </div>
            </div>
        </div>
    );
}
