"use client";
import { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import ContributionChart from "../components/ContributionChart";
import html2canvas from "html2canvas";

const Home = () => {
  const [level, setLevel] = useState<number>(1);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(event.target.value);
    setLevel(newLevel);
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

  return (
    <div className="container">
      <div className="content">
        <h1>GitHub Contributions Graph Faker</h1>
        <h2>Brag with Your GitHub Contributions 🚀 Stand Out Instantly 😉</h2>
        <p className="mb-10">Showcase an impressive GitHub activity streak effortlessly. </p>

        <div className="flex items-center space-x-3">
          <label htmlFor="level">No Coder</label>
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
          <label htmlFor="level">10x Maniac Coder</label>
        </div>

        <div className="flex space-x-4 mt-2">
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

          <button
            onClick={handleScreenshot}
            className="mt-2 p-2 bg-blue-500 text-white rounded-md flex items-center"
          >
            Download Chart
          </button>
        </div>

        <div className="w-full overflow-x-auto py-4">
  <div className="">
    <ContributionChart level={level} darkMode={darkMode} />
  </div>
</div>
      </div>
      <div className="footer  text-gray-500">
        <p>
          Made with ☕ by <a href="https://x.com/sailing_dev">Sailing_dev</a>
        </p>
      </div>
    </div>
  );
};

export default Home;
