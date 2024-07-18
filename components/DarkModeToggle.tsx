// DarkModeToggle.tsx
import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

interface DarkModeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

function DarkModeToggle({ darkMode, toggleDarkMode }: DarkModeToggleProps) {
  return (
    <button
      onClick={toggleDarkMode}
      className="mt-2 p-2 bg-blue-500 text-white rounded-md flex items-center"
    >
      {darkMode ? (
        <>
          <SunIcon className="h-5 w-5 mr-2" />
          Switch to Light Mode
        </>
      ) : (
        <>
          <MoonIcon className="h-5 w-5 mr-2" />
          Switch to Dark Mode
        </>
      )}
    </button>
  );
}

export default DarkModeToggle;
