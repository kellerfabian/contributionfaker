import { useEffect, useState } from "react";
import styles from "./ContributionChart.module.css";

interface ContributionData {
  day: string;
  value: number;
}

interface ContributionChartProps {
  level: number;
  darkMode: boolean;
  resetKey: number;
}

const generateData = (level: number): ContributionData[] => {
  const today = new Date();
  const data: ContributionData[] = [];

  // Calculate the first day of the current year and last year
  const firstDayOfCurrentYear = new Date(today.getFullYear(), 0, 1);
  const firstDayOfLastYear = new Date(today.getFullYear() - 1, 0, 1);

  // Find the day of the week (0 = Sunday, 6 = Saturday) for the first day of last year
  const firstDayOfWeekLastYear = firstDayOfLastYear.getDay();

  // We need to add extra days to cover the entire first week of the previous year
  const extraDays = firstDayOfWeekLastYear === 0 ? 0 : firstDayOfWeekLastYear;

  // Generate data for 365 + extraDays
  for (let i = 0; i < 365 + extraDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    let value = Math.round(Math.random() * level);

    if (level === 1 && Math.random() < 0.7) {
      value = 0; // 70% chance of having an empty day for level 1
    } else if (level === 13 || level === 14) {
      value = Math.max(1, value); // Ensure there are no empty days for levels 14 and 15
    } else if (level === 15) {
      value = 4;
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

    // Start a new week on Sunday (dayOfWeek === 0) or if the current week has 7 days
    if (dayOfWeek === 0 || currentWeek.length === 7) {
      if (currentWeek.length) {
        const firstDate = new Date(currentWeek[0].day);
        const weekMonthKey = `${firstDate.getFullYear()}-${
          firstDate.getMonth() + 1
        }`;
        if (!weeksByMonth[weekMonthKey]) {
          weeksByMonth[weekMonthKey] = [];
        }
        weeksByMonth[weekMonthKey].push(currentWeek);
      }
      currentWeek = [];
    }

    currentWeek.push(entry);
  });

  // Push the last week if it has entries
  if (currentWeek.length) {
    const firstDate = new Date(currentWeek[0].day);
    const weekMonthKey = `${firstDate.getFullYear()}-${
      firstDate.getMonth() + 1
    }`;
    if (!weeksByMonth[weekMonthKey]) {
      weeksByMonth[weekMonthKey] = [];
    }
    weeksByMonth[weekMonthKey].push(currentWeek);
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

const ContributionChart: React.FC<ContributionChartProps> = ({
  level,
  darkMode,
  resetKey,
}) => {
  const [data, setData] = useState<ContributionData[]>([]);
  const [weeksByMonth, setWeeksByMonth] = useState<{
    [key: string]: ContributionData[][];
  }>({});
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState<number | null>(null);

  useEffect(() => {
    const newData = generateData(level).reverse();
    setData(newData);
    const newWeeksByMonth = groupDataByWeeks(newData);
    setWeeksByMonth(newWeeksByMonth);
  }, [level, resetKey]);

  const handleMouseDown = (day: ContributionData) => {
    setIsDrawing(true);

    // Determine the initial color based on the starting cell's current value
    if (day.value === 0) {
      const newValue = Math.floor(Math.random() * level) + 1; // Random value between 1 and level
      setCurrentColor(newValue); // Set current drawing color
      day.value = newValue; // Set initial cell to random value
    } else {
      setCurrentColor(0); // Set current drawing color to 0 (clearing)
      day.value = 0; // Clear the initial cell
    }

    setData([...data]); // Update the data
  };

  const handleMouseMove = (day: ContributionData) => {
    if (isDrawing) {
      day.value = currentColor as number; // Apply the current color to the cell being hovered
      setData([...data]); // Update the data while dragging
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const dayLabels = ["Mon", "", "Wed", "", "Fri", "", ""];

  return (
    <div className="overflow-x-auto">
      <div
        id="contribution-chart"
        className={`p-3 ${styles.tableContainer} ${
          darkMode ? styles.tableDark : styles.tableLight
        } rounded-md`}
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
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
            {dayLabels.map((label, index) => (
              <tr key={index}>
                <td
                  className={
                    darkMode ? styles.dayLabelDark : styles.dayLabelLight
                  }
                  onMouseDown={(e) => e.stopPropagation()} // Prevent mouse events on labels
                  onMouseMove={(e) => e.stopPropagation()} // Prevent mouse events on labels
                >
                  {label}
                </td>
                {Object.keys(weeksByMonth)
                  .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                  .flatMap((monthKey) =>
                    weeksByMonth[monthKey].map((week, weekIndex) => (
                      <td
                        key={`${monthKey}-${weekIndex}-${index}`}
                        className={styles.weekCell}
                      >
                        <div
                          className={styles.dayCell}
                          style={{
                            backgroundColor: getColor(
                              week[index]?.value || 0,
                              darkMode
                            ),
                          }}
                          title={`Date: ${
                            week[index]?.day || "N/A"
                          }, Contributions: ${week[index]?.value || 0}`}
                          onMouseDown={() =>
                            week[index]?.day && handleMouseDown(week[index])
                          }
                          onMouseMove={() =>
                            week[index]?.day && handleMouseMove(week[index])
                          }
                        ></div>
                      </td>
                    ))
                  )}
              </tr>
            ))}
          </tbody>
        </table>
        <div
          className={`mt-2 flex justify-between items-center ${
            darkMode ? styles.monthHeaderDark : styles.monthHeaderLight
          }`}
        >
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn how we count contributions
          </a>
          <div className={`${styles.legend} pr-5`}>
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
    </div>
  );
};

export default ContributionChart;
