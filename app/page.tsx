"use client";
import { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import ContributionChart from "../components/ContributionChart";

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

  return (
    <div className="container">
      <div className="content">
        <h1>GitHub Contributions Graph Faker</h1>
        <h2>Brag with Your GitHub Contributions 🚀</h2>

        <p>Stand Out Instantly 🌟</p>
        <p>Showcase an impressive GitHub activity streak effortlessly. </p>

        <p className="mb-10">
          Decide how intense you want your graph to be or opt for a &quot;no
          coder&quot; vibe.
        </p>

        <label className="mr-3" htmlFor="level">
          Coding Level (no coder - maniac coder):
        </label>
        <input
          type="range"
          id="level"
          name="level"
          min="0"
          max="15"
          value={level}
          onChange={handleChange}
        />
        <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        <ContributionChart level={level} darkMode={darkMode} />
      </div>
      <div className="footer">
        <p>
          Made with ☕ by <a href="https://x.com/sailing_dev">Sailing_dev</a>
        </p>
      </div>
    </div>
  );
};

export default Home;
