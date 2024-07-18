"use client";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import DarkModeToggle from "./DarkModeToggle";
interface ContributionData {
  day: string;
  value: number;
}

const generateData = (level: number): ContributionData[] => {
  const today = new Date();
  const data: ContributionData[] = [];
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    let value = Math.round(Math.random() * level);
    if (level === 1 && Math.random() < 0.7) {
      value = 0; // 70% chance of having an empty day for level 1
    } else if (level === 9 || level === 10) {
      value = Math.max(1, value); // Ensure there are no empty days for levels 9 and 10
    }
    data.push({
      day: date.toISOString().split("T")[0],
      value: value,
    });
  }
  return data;
};

const getColor = (value: number, darkMode: boolean): string => {
  if (value === 0) return darkMode ? "#2d333b" : "#ebedf0";
  if (value === 1) return darkMode ? "#0e4429" : "#9be9a8";
  if (value === 2) return darkMode ? "#006d32" : "#40c463";
  if (value === 3) return darkMode ? "#26a641" : "#30a14e";
  return darkMode ? "#39d353" : "#216e39";
};

const getMonthLabel = (monthIndex: number): string => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[monthIndex];
};

const groupDataByWeeks = (
  data: ContributionData[]
): { [key: string]: ContributionData[][] } => {
  const weeksByMonth: { [key: string]: ContributionData[][] } = {};
  let currentWeek: ContributionData[] = [];

  data.forEach((entry) => {
    const date = new Date(entry.day);
    const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

    // Start a new week on Monday
    if (dayOfWeek === 1 || currentWeek.length === 7) {
      if (currentWeek.length) {
        if (!weeksByMonth[monthKey]) {
          weeksByMonth[monthKey] = [];
        }
        weeksByMonth[monthKey].push(currentWeek);
      }
      currentWeek = [];
    }
    currentWeek.push(entry);
  });

  if (currentWeek.length) {
    const date = new Date(currentWeek[0].day);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!weeksByMonth[monthKey]) {
      weeksByMonth[monthKey] = [];
    }
    weeksByMonth[monthKey].push(currentWeek);
  }

  // Ensure each week has 7 days, filling with empty days if necessary
  Object.keys(weeksByMonth).forEach((monthKey) => {
    weeksByMonth[monthKey].forEach((week) => {
      while (week.length < 7) {
        week.push({ day: "", value: 0 });
      }
    });
  });

  return weeksByMonth;
};

export default function Home() {
  const [level, setLevel] = useState<number>(1);
  const [data, setData] = useState<ContributionData[]>([]);
  const [weeksByMonth, setWeeksByMonth] = useState<{
    [key: string]: ContributionData[][];
  }>({});
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const newData = generateData(level);
    setData(newData);
    const newWeeksByMonth = groupDataByWeeks(newData);
    setWeeksByMonth(newWeeksByMonth);
  }, [level]);

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

        <p  className="mb-10">
          Decide how intense you want your graph to be or opt for a &quot;no
          coder&quot; vibe.
        </p>

        <label className="mr-3" htmlFor="level">Coding Level (1-10):</label>
        <input
          type="range"
          id="level"
          name="level"
          min="1"
          max="10"
          value={level}
          onChange={handleChange}
        />
        <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        <div
          className={`${styles.tableContainer} ${
            darkMode ? styles.tableDark : styles.tableLight
          } rounded-md`}
        >
          <table className={styles.table}>
            <thead>
              <tr>
                {Object.keys(weeksByMonth)
                  .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                  .map((monthKey) => {
                    const monthIndex = parseInt(monthKey.split("-")[1], 10) - 1;
                    return (
                      <th
                        key={monthKey}
                        colSpan={weeksByMonth[monthKey].length}
                        className={
                          darkMode
                            ? styles.monthHeaderDark
                            : styles.monthHeaderLight
                        }
                      >
                        {getMonthLabel(monthIndex)}
                      </th>
                    );
                  })}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.keys(weeksByMonth)
                  .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                  .flatMap((monthKey) =>
                    weeksByMonth[monthKey].map((week, weekIndex) => (
                      <td
                        key={`${monthKey}-${weekIndex}`}
                        className={styles.weekCell}
                      >
                        <div className={styles.weekGrid}>
                          {week.map((day, dayIndex) => (
                            <div
                              key={dayIndex}
                              className={styles.dayCell}
                              style={{
                                backgroundColor: getColor(day.value, darkMode),
                              }}
                              title={`Date: ${day.day}, Contributions: ${day.value}`}
                            ></div>
                          ))}
                        </div>
                      </td>
                    ))
                  )}
              </tr>
            </tbody>
          </table>
          <div
            className={`${styles.legend} ${
              darkMode ? styles.monthHeaderDark : styles.monthHeaderLight
            }`}
          >
            <span>Less</span>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: darkMode ? "#2d333b" : "#ebedf0" }}
            ></div>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: darkMode ? "#0e4429" : "#9be9a8" }}
            ></div>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: darkMode ? "#006d32" : "#40c463" }}
            ></div>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: darkMode ? "#26a641" : "#30a14e" }}
            ></div>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: darkMode ? "#39d353" : "#216e39" }}
            ></div>
            <span>More</span>
          </div>
        </div>
      </div>
      <div className="footer">
        <p>
          Made with ☕ by{" "}
          <a href="https://x.com/sailing_dev">Sailing_dev</a>
        </p>
      </div>
    </div>
  );
}
