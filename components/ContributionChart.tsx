import { useEffect, useState } from "react";
import styles from "./ContributionChart.module.css";
import { generateMatrix } from "@/helpers/generateMatrix";
import { applyCharacterPattern } from "@/helpers/applyCharacterPatterns";
import { ContributionData } from "@/types";

interface ContributionChartProps {
  level: number;
  darkMode: boolean;
  resetKey: number;
  providedText?: string;
}

const ContributionChart: React.FC<ContributionChartProps> = ({
  level,
  darkMode,
  resetKey,
  providedText = "",
}) => {
  const [data, setData] = useState<ContributionData[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState<number | null>(null);

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

  useEffect(() => {
    const baseMatrix = generateMatrix(level, 7, 53); // 7 days per week, 53 weeks (including extra days to cover the full year)

    const matrixWithText = providedText
      ? applyCharacterPattern(baseMatrix, providedText, 0, 0)
      : baseMatrix;

    setData(matrixWithText);
  }, [providedText, resetKey, level]);

  const handleMouseDown = (day: ContributionData) => {
    setIsDrawing(true);
    const newValue =
      day.value === 0 ? Math.floor(Math.random() * level) + 1 : 0;
    setCurrentColor(newValue);
    day.value = newValue;
    setData([...data]);
  };

  const handleMouseMove = (day: ContributionData) => {
    if (isDrawing && currentColor !== null) {
      day.value = currentColor;
      setData([...data]);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setCurrentColor(null);
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const getColor = (value: number, darkMode: boolean): string => {
    if (value === 0) return darkMode ? "#2d333b" : "#ebedf0";
    if (value === 1) return darkMode ? "#0e4429" : "#9be9a8";
    if (value === 2) return darkMode ? "#006d32" : "#40c463";
    if (value === 3) return darkMode ? "#26a641" : "#30a14e";
    return darkMode ? "#39d353" : "#216e39";
  };

  const dayLabels = ["Mon", "", "Wed", "", "Fri", "", ""];

  // Helper function to calculate which weeks belong to which months
  const getMonthWeeks = () => {
    const monthWeeks: { [key: string]: number } = {
      Jan: 5,
      Feb: 4,
      Mar: 5,
      Apr: 4,
      May: 5,
      Jun: 4,
      Jul: 5,
      Aug: 4,
      Sep: 5,
      Oct: 4,
      Nov: 5,
      Dec: 5,
    };
    return Object.keys(monthWeeks).map((month) => ({
      month,
      weeks: monthWeeks[month],
    }));
  };

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
              {getMonthWeeks().map(({ month, weeks }) => (
                <th
                  key={month}
                  colSpan={weeks}
                  className={
                    darkMode ? styles.monthHeaderDark : styles.monthHeaderLight
                  }
                >
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dayLabels.map((label, rowIndex) => (
              <tr key={rowIndex}>
                <td
                  className={
                    darkMode ? styles.dayLabelDark : styles.dayLabelLight
                  }
                >
                  {label}
                </td>
                {data[rowIndex]?.map((cell, colIndex) => (
                  <td key={colIndex} className={styles.weekCell}>
                    <div
                      className={styles.dayCell}
                      style={{
                        backgroundColor: getColor(cell.value, darkMode),
                      }}
                      title={`Value: ${cell.value}`}
                      onMouseDown={() => handleMouseDown(cell)}
                      onMouseMove={() => handleMouseMove(cell)}
                    ></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 flex justify-between items-center">
          <a href="#" target="_blank" rel="noopener noreferrer">
            Learn how we count contributions
          </a>
          <div className="legend pr-5 flex items-center">
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
