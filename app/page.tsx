"use client";
import { Suspense, useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import ContributionChart from "../components/ContributionChart";
import html2canvas from "html2canvas";
import Link from "next/link";
import { GithubIcon } from "@/components/GithubLogo";
import Image from "next/image";
import { ArrowDownCircleIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

export default function Home() {
  const [level, setLevel] = useState<number>(3);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [resetKey, setResetKey] = useState<number>(0);
  const [textToDraw, setTextToDraw] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(event.target.value);
    setLevel(newLevel);
  };

  const handleReset = () => {
    setResetKey((prevKey) => prevKey + 1);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleScreenshot = () => {
    const chartElement = document.getElementById("contribution-chart");
    if (chartElement) {
      html2canvas(chartElement).then((canvas) => {
        const link = document.createElement("a");
        link.download = "contribution-chart.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  const handleTextToDrawChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTextToDraw(event.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="content text-center">
        <h1 className="text-3xl font-bold mb-2">
          GitHub Contributions Graph Faker
        </h1>
        <h2 className="text-xl text-gray-400 mb-6">
          Brag with Your GitHub Contributions 🚀 Stand Out Instantly 😉
        </h2>

        {/* Level Slider */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <label htmlFor="level" className="text-gray-400">
            No Coder
          </label>
          <input
            type="range"
            id="level"
            name="level"
            min="0"
            max="15"
            value={level}
            onChange={handleChange}
            className="flex-grow"
          />
          <label htmlFor="level" className="text-gray-400">
            10x Maniac Coder
          </label>
        </div>

        {/* Contribution Chart */}
        <div className="w-full overflow-x-auto py-4">
          <Suspense fallback={<div>Loading...</div>}>
            <ContributionChart
              resetKey={resetKey}
              level={level}
              darkMode={darkMode}
              providedText={textToDraw}
            />

            {/* Buttons and Dark Mode Toggle */}
            <div className="flex justify-left space-x-4 mt-2 ml-3">
              <DarkModeToggle
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />

              <button
                onClick={handleScreenshot}
                // className="h-10 px-4 bg-blue-500 text-white rounded-md flex items-center justify-center"
              >
                <ArrowDownCircleIcon className="h-5 w-5 mr-2" />
              </button>

              <button
                onClick={handleReset}
                // className="h-10 px-4 text-white rounded-md flex items-center justify-center"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
              </button>
            </div>
          </Suspense>
        </div>

        {/* Text Input for Drawing and Click to Draw Image in One Row */}
        <div className="w-full py-4 flex justify-between items-center space-x-4">
          <div className="flex-shrink-0">
            <Image
              src="/clicktodraw.png"
              alt="Click and hold your mouse on a cell to draw"
              width={300}
              height={150}
            />
          </div>
          <input
            type="text"
            className={`flex-grow ml-5 p-3 text-center border ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-white text-black border-gray-300"
            } rounded-md`}
            placeholder="Type here to draw"
            value={textToDraw}
            onChange={handleTextToDrawChange}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="footer text-gray-500 mt-8">
        <div className="flex items-center justify-center space-x-2">
          <p>
            Made with ☕ by{" "}
            <Link
              href="https://x.com/sailing_dev"
              className="text-blue-500"
              target="_blank"
            >
              Sailing_dev
            </Link>
            {" and "}
            <Link
              href="https://datafakery.io"
              className="text-blue-500"
              target="_blank"
            >
              DataFakery
            </Link>
          </p>
          <Link
            href="https://github.com/kellerfabian/contributionfaker"
            className="ml-auto"
            target="_blank"
          >
            <GithubIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
