"use client";
import { useState } from "react";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";

export default function Home() {
  return (
    <div className="min-h-screen text-black bg-black flex flex-col items-center gap-5">
      <div className="w-full max-w-[1800px] h-[800px] border-2 border-black flex flex-col justify-start items-center">
        <Navigation />
        <div className="flex items-center justify-center gap-5 p-5 m-[111px]">
          <Banner1Box />
          <Banner2Box />
        </div>
      </div>

      <MainContent />
    </div>
  );
}

function Navigation() {
  return (
    <nav className="border-2 border-black m-5 flex bg-black shadow-white items-center justify-between px-4 w-full max-w-[500px] rounded-xl shadow-xl">
      {/* Logo Section */}
      <div className="w-[50x] h-[50px] border-2 border-transparent bg-transperent flex items-center justify-center ml 5px">
        <img
          src="/logo.svg"  // Path to your logo.svg file in the public folder
          alt="Logo"
          className="w-full h-full object-contain"  // Ensures the logo scales properly
        />
      </div>

      {/* Navigation Links */}
      <div className="w-[500px] text-green-500 flex justify-center items-center space-x-8">
        <div className="text-3xl font-extrabold text-gray-300 text-center">
          AWAKE
        </div>
      </div>

      {/* Settings Icon */}
      <div className="w-[40px] h-[40px] border-2 border-transparent bg-transparent flex items-center justify-center cursor-pointer hover:bg-gray-200">
        <img
            src="/sun.svg"
            alt="light-dark"
            className="w-full h-full object-contain"
          />
      </div>
    </nav>
  );
}



function Banner1Box() {
  return (
    <div className="text-gray-300 w-[606px] h-[430px] border-2 border-black bg-transparent flex flex-col gap-6 p-4">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-700 to-gray-900 whitespace-nowrap">Upgrade your life<br className="hidden md:block"/>
      </span> with tiny habits</h1>
      <SubBanner />
      <Button />
    </div>
  );
}


function Banner2Box() {
  const messages = [
    "Learn Japanese",
    "Practice Piano",
    "Read more",
    "No Junk",
    "Play Basketball",
    "Workout",
  ];

  const tips = [
    "Consistency is key, practice every day.",
    "Start slow, focus on mastering basics first.",
    "Set a goal for each book to stay motivated.",
    "Balance your diet and avoid processed foods.",
    "Focus on your shooting technique and footwork.",
    "Aim for small, progressive improvements over time."
  ];

  const [messageIndex, setMessageIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isStruckThrough, setIsStruckThrough] = useState(false);
  const [showConfitte, setShowConfitte] = useState(false);

  const handleCheckboxChange = () => {
    setIsStruckThrough(true);
    const sound = new Audio("/habit-completion.mp3");
    sound.play();

    setShowConfitte(true);

    setTimeout(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
      setIsChecked(false);
      setIsStruckThrough(false);
      setShowConfitte(false);
    }, 1300);
  };


  return (
    <div className="relative w-[433px] h-[430px] bg-transparent flex items-center flex-col gap-4">
      {showConfitte && (
      <Confetti
        width={1000}
        height={1000}
        numberOfPieces={100} // Reduced number of pieces for a more subtle effect
        gravity={0.2} // Light gravity to control the descent
        initialVelocityX={Math.random() * 30 - 15} // Randomized horizontal velocity to simulate a throwing direction
        initialVelocityY={Math.random() * 20 - 10} // Random vertical force for more randomness
        recycle={false}
        confettiSource={{
          x: 400,
          y: 0,
          w: 10,
          h: 10,
        }}
      />
    )}



      <div className="flex items-center h-[20px]">
        <div className="text-1xl w-[330px] h-[10px] flex border-2 border-transparent gap-4 pl-[100px] justify-end">
          <p className="text-gray-200">Do your tasks....</p>
        </div>
        <div className="w-[100px] h-[100px] border-2 border-transparent bg-transparent flex items-center justify-center">
          <img
            src="/spark.svg"
            alt="light-dark"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="text-3xl text-gray-300 w-[400px] h-[60px]  bg-black flex rounded-lg items-center justify-between px-4">
        <p className={isStruckThrough ? "line-through" : ""}>{messages[messageIndex]}</p>
        <label htmlFor="messageCheckbox" className="relative cursor-pointer">
        <div className="relative group cursor-pointer">
          <input
            type="checkbox"
            id="messageCheckbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="absolute opacity-0 w-8 h-8"
          />
          {/* Tick icon (or any visual representation) */}
          <svg
            className="absolute opacity-0 w-8 h-8 text-green-500 group-hover:opacity-100 transition-opacity duration-200"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

          <div
            className={`w-8 h-8 border-2 border-white rounded-lg flex items-center justify-center transition-all duration-300 ${
              isChecked ? "bg-green-500" : "bg-transparent"
            }`}
          >
            {isChecked && (
              <span className="text-white text-lg">✔</span>
            )}
          </div>
        </label>
      </div>

        <div className="text-1xl w-[400px] h-[20px] flex border-2 border-transparent gap-4 justify-start  pt-[60px] m-2">
          <p className="text-gray-200">with insights from your AI!</p>
        </div>

      <div className="text-2xl w-[400px] text-gray-300 h-[100px] border-2 border-black text-center bg-black flex rounded-lg items-center">
        <p>{tips[messageIndex]}</p>
      </div>
    </div>
  );
}


function SubBanner() {
  return(
  <div className="w-[448px] h-[58px] border-2 border-black bg-transparent">
    Because its more about willing to <br /> than wanting to.
  </div>
  );
}

function Button() {
  const router = useRouter();

  return (
    <div className="w-[250px] h-[158px] border-2 border-black bg-transparent">
      <div className="flex flex-col items-start justify-start h-full p-2 space-y-1">
        <button
          onClick={() => router.push("/signup")}
          className="w-full h-12 bg-gray-900 text-white font-bold rounded-full hover:bg-green-800 transition duration-200"
        >
          Join
        </button>
        <button
          onClick={() => router.push("/login")}
          className="w-full h-12 bg-transparent text-gray-600 font-bold rounded-md 
                     hover:text-gray-900 hover:border hover:border-gray-400 transition duration-200"
        >
          I have an account
        </button>
      </div>
    </div>
  );
}


function MainContent() {
  return (
    <div className="w-full max-w-[1800px] items-center min-h-screen border-2 border-black pt-10 flex flex-col gap-10 p-5">
      <SimpleOverview />
      <div className="shadow-white shadow-lg justify-start w-[1100px] h-[500px] border-2 border-black text-black p-5">
        <h1 className="text-4xl text-transparent bg-clip-text bg-gradient-to-b from-gray-500 to-gray-900 whitespace-nowrap font-semibold text-center mb-5">While you focus on those steps, we take care of the rest</h1>
        <p className="text-2xl text-gray-300 text-center">
          At our core, we help you focus on what truly matters. Every time you open an app, we ask, “How does this align with your goals?” 
          We guide you in making each interaction purposeful, ensuring your device becomes a tool for growth, not distraction. 
          With every app you use, you take intentional steps toward your aspirations. Our approach isn't about eliminating distractions 
          but about helping you use everything with intention, aligning your actions with your larger vision.
        </p>
      </div>

      <InfoSection1 />
      <div className="shadow-white shadow-lg justify-start w-[1100px] h-[500px] border-2 border-black text-black p-5">
        <h1 className="text-4xl text-transparent bg-clip-text bg-gradient-to-b from-gray-500 to-gray-900 whitespace-nowrap font-semibold text-center mb-5">Well, this shouldn’t be hard <br /> but it's not you who pulls the leg, but your environment.</h1>
        <p className="text-2xl text-gray-300 text-center">
        The greatest challenges often don’t arise from our own limitations but from the environment we navigate. Distractions, societal norms, and unforeseen obstacles shape the difficulty of our journey. It’s easy to assume that effort alone determines success, but the truth is, external forces constantly push and pull, influencing every step. The key is not just personal discipline but also mastering the ability to shape or adapt to the conditions around you. True progress comes when you recognize the hidden barriers in your environment and systematically dismantle them—turning what seemed hard into something inevitable.
        </p>
      </div>
      <InfoSection2 />
    </div>
  );
}


function Section({ title, children }: { title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="justify-start w-[1100] h-[500] border-2 border-black text-black p-5">
      <h2 className="text-4xl text-gray-300 font-semibold text-center">{title}</h2>
      {children && <div className="mt-3 space-y-5">{children}</div>}
    </div>
  );
}

function SimpleOverview() {
  return (
    <div className="w-full max-w-[1800px]  h-[600px] border-2 border-black text-black flex flex-col justify-start items-center gap-5 p-5">
      <h2 className="text-6xl text-gray-300 font-semibold text-center ">
        Building lasting habits is easy <br/>
      </h2>
      <h2 className="text-3xl text-transparent bg-clip-text bg-gradient-to-b from-gray-500 to-gray-900 whitespace-nowrap text-bold text-end mb-6 font-bold">-when your environment is clean.</h2>
      
      <div className="flex justify-center gap-5 shadow-white shadow-lg">
            <div className="w-[300px] h-[252px] border-2 border-black bg-black text-white p-6 rounded-xl">
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <span className="text-6xl md:text-7xl">🎯</span>
              <div className="text-center md:text-left">
                <div className="card-title pb-4 text-2xl font-semibold">Set your goals</div>
                <div className="italic opacity-80 text-lg">
                  <div>"I will learn Next Js"</div>
                  <div>"I will be the best programmer"</div>
                </div>
              </div>
            </div>
          </div>



          <div className="w-[300px] h-[252px] border-2 border-black bg-black text-white p-6 rounded-xl">
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <span className="text-6xl md:text-7xl -scale-x-1">🏃</span>
              <div className="text-center md:text-left">
                <div className="card-title pb-4 text-2xl font-semibold">Work on them</div>
                <div className="italic opacity-80 text-lg">
                  <div>Read relavent resources</div>
                  <div>Desciplined and Consistent</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[300px] h-[260px] border-2 border-black bg-black text-white p-6 rounded-xl">
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <span className="text-6xl md:text-7xl">🔁</span>
              <div className="text-center md:text-left">
                <div className="card-title pb-4 text-2xl font-semibold">Reflect and repeat...</div>
                <div className="italic opacity-80 text-lg">
                  <div>“Refine aspects that didn't work”</div>
                  <div>“Continouous growth”</div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}


function InfoSection1() {
  return (
    <div className="w-full flex flex-wrap justify-center gap-5 border-2 border-black p-5">
      <div className="w-1/3 max-w-sm h-[448px] border-2 border-black rounded-[50px]">
      <video 
          className="w-full h-full rounded-[50px] object-cover"
          src="/educateVideo.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
        />
      </div>
      <div className="w-[700px] h-[480px] border-2 border-black  p-[100] ">
        <p className="m-2 text-2xl text-transparent bg-clip-text bg-gradient-to-b from-gray-400 to-gray-800 whitespace-nowrap mb-2 font-bold">Continuous Feedback</p>
        <h1 className="m-2 text-5xl text-gray-300 font-bold mb-5">Master your habits in no time</h1>
        <p className="m-2 text-gray-300 mb-5">Get advice on how to turn your goals into actions. Learn how to build good habits and break bad ones with daily tips.<b/> If you enjoyed Atomic Habits, you'll love Habits Garden!</p>
        <button className="m-2 w-[400px] h-[50] bg-gray-900 text-white font-bold rounded-full">
          Get 1% better everyday
        </button>
      </div>

    </div>
  );
}

function InfoSection2() {
  return (
    <div className="w-full flex flex-wrap justify-center gap-5 border-2 border-black p-[100] ">
      <div className="w-1/3 max-w-sm border-2 border-black rounded-[50px] h-auto">
        <video 
          className="w-full h-full rounded-[50px] object-cover"
          src="/streakVideo.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
        />
      </div>

      <div className="w-[700px] h-[480px] border-2 border-black ">
        <p className="m-2 text-2xl text-transparent bg-clip-text bg-gradient-to-b from-gray-500 to-gray-900 whitespace-nowrap mb-2 font-bold">Progress tracking</p>
        <h1 className="m-2 text-5xl text-gray-300 font-bold mb-5">Become a productivity superhero</h1>
        <p className="m-2 text-gray-300 mb-5">Get daily reminders to complete your habits so you never forget them. Visualize your growth with the Habit Grid to stay motivated. Don't break the chain!</p>
        <button className="m-2 w-[400px] h-[50px] bg-gray-900 text-white font-bold rounded-full">
          Achieve my goals
        </button>
      </div>
    </div>
  );
}
