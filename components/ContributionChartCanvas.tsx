import React, { useEffect, useRef } from "react";
import styles from "./ContributionChart.module.css";

interface ContributionData {
  day: string;
  value: number;
}

interface ContributionChartProps {
  level: number;
  darkMode: boolean;
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

const ContributionChartCanvas: React.FC<ContributionChartProps> = ({
  level,
  darkMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = generateData(level).reverse();
    const canvas = canvasRef.current;
    const tooltip = tooltipRef.current;

    if (canvas && tooltip) {
      const ctx = canvas.getContext("2d");
      const cellSize = 10;
      const cellPadding = 2;
      const canvasWidth = 53 * (cellSize + cellPadding) + 30; // 53 weeks in a year, + space for labels
      const canvasHeight = 7 * (cellSize + cellPadding) + 20; // 7 days in a week, + space for labels

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      if (ctx) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw month labels
        ctx.font = "10px Arial";
        ctx.fillStyle = darkMode ? "#c9d1d9" : "#000";
        for (let i = 0; i < 12; i++) {
          const monthX = i * (canvasWidth / 12);
          ctx.fillText(getMonthLabel(i), monthX + 35, 10);
        }

        // Draw day labels
        const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        for (let i = 0; i < dayLabels.length; i++) {
          const dayY = i * (cellSize + cellPadding) + 20;
          ctx.fillText(dayLabels[i], 5, dayY + cellSize);
        }

        // Draw cells
        data.forEach((contribution, index) => {
          const date = new Date(contribution.day);
          const week = Math.floor(index / 7);
          const dayOfWeek = date.getDay();

          const x = week * (cellSize + cellPadding) + 30;
          const y = dayOfWeek * (cellSize + cellPadding) + 20;

          ctx.fillStyle = getColor(contribution.value, darkMode);
          ctx.fillRect(x, y, cellSize, cellSize);

          canvas.addEventListener("mousemove", (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const hoveredWeek = Math.floor((mouseX - 30) / (cellSize + cellPadding));
            const hoveredDayOfWeek = Math.floor((mouseY - 20) / (cellSize + cellPadding));

            if (
              hoveredWeek === week &&
              hoveredDayOfWeek === dayOfWeek &&
              index === hoveredWeek * 7 + hoveredDayOfWeek
            ) {
              tooltip.style.display = "block";
              tooltip.style.left = `${event.clientX + 10}px`;
              tooltip.style.top = `${event.clientY + 10}px`;
              tooltip.innerHTML = `Date: ${contribution.day}, Contributions: ${contribution.value}`;

              // Highlight the hovered cell
              ctx.clearRect(x - 1, y - 1, cellSize + 2, cellSize + 2);
              ctx.fillStyle = getColor(contribution.value, darkMode);
              ctx.fillRect(x, y, cellSize, cellSize);
              ctx.strokeStyle = darkMode ? "#fff" : "#000";
              ctx.strokeRect(x, y, cellSize, cellSize);
            } else {
              // Redraw the cell without highlight
              ctx.clearRect(x - 1, y - 1, cellSize + 2, cellSize + 2);
              ctx.fillStyle = getColor(contribution.value, darkMode);
              ctx.fillRect(x, y, cellSize, cellSize);
            }
          });

          canvas.addEventListener("mouseout", () => {
            tooltip.style.display = "none";
          });
        });
      }
    }
  }, [level, darkMode]);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas}></canvas>
      <div ref={tooltipRef} className={styles.tooltip}></div>
      <div
        className={`m-3 ${styles.legend} ${
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
  );
};

export default ContributionChartCanvas;
