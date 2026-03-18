import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import {useDarkMode} from "../contexts/Darkmodecontext.tsx";

const DarkModeToggle = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    return (
        <button
            onClick={toggleDarkMode}
            className="relative w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle dark mode"
        >
            <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                    isDarkMode ? 'translate-x-7' : 'translate-x-0'
                }`}
            >
                {isDarkMode ? (
                    <MoonIcon className="h-4 w-4 text-gray-700" />
                ) : (
                    <SunIcon className="h-4 w-4 text-yellow-500" />
                )}
            </div>
        </button>
    );
};

export default DarkModeToggle;