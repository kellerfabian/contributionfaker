import { ContributionData } from "@/types";

export const generateMatrix = (
  level: number, // Maximum contribution value (level)
  rows: number, // Number of rows (usually 7 for days in a week)
  cols: number // Number of columns (weeks, around 52-53)
): ContributionData[][] => {
  const matrix: ContributionData[][] = [];

  for (let i = 0; i < rows; i++) {
    const row: ContributionData[] = [];
    for (let j = 0; j < cols; j++) {
      let value = Math.round(Math.random() * level); // Default value is random between 0 and level

      // Adjust the logic based on the levels
      if (level === 1 && Math.random() < 0.7) {
        value = 0; // 70% chance of having an empty day for level 1
      } else if (level === 11 || level === 12) {
        value = Math.max(1, value); // Ensure no empty days, but allow variance (1 to level)
      } else if (level === 13) {
        value = Math.random() < 0.3 ? Math.max(1, value) : 4; // Ensure higher values with a higher chance of green
      } else if (level === 14) {
        value = Math.random() < 0.5 ? Math.max(2, value) : 4; // Even more green cells
      } else if (level === 15) {
        value = 4; // All cells are fully filled with the highest value for level 15
      }

      row.push({
        day: "", // Placeholder for the actual date or leave empty
        value: value, // Assign the calculated value
      });
    }
    matrix.push(row); // Add the generated row (week) to the matrix
  }

  return matrix;
};
