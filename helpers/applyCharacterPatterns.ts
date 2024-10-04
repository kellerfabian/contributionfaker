import { charPattern } from "./charPattern";
import { ContributionData } from "@/types";

export const applyCharacterPattern = (
  matrix: ContributionData[][],
  text: string,
  startingRow: number,
  startingCol: number
): ContributionData[][] => {
  const chars = text.split("");

  let rowIndex = startingRow + 1; // Skip the first row
  let colIndex = startingCol;

  chars.forEach((char) => {
    if (char === " ") {
      colIndex += 1;
      return;
    }

    const pattern = charPattern[char];
    if (!pattern) return;

    // Apply the pattern for each character, starting from the second row
    for (let i = 0; i < pattern.length; i++) {
      for (let j = 0; j < pattern[i].length; j++) {
        // Check if we're within the bounds of the matrix
        if (matrix[rowIndex + i] && matrix[rowIndex + i][colIndex + j]) {
          // If the pattern contains 1, change the value to 0 (darken the cell)
          if (pattern[i][j] === 1) {
            matrix[rowIndex + i][colIndex + j].value = 0;
          }
        }
      }
    }

    colIndex += 6; // Adjust the offset for space between characters
  });

  return matrix;
};
