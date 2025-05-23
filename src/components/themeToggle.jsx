import { useTheme } from './Theme.jsx';
import { Moon, Sun } from "lucide-react"; 
import '../css/ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-wrapper">
      <button onClick={toggleTheme} className={`toggle ${theme}`}>
        <div className="slider">
          {theme === "dark" ? <Moon size={18} className="icon moon" />  :  <Sun size={18} className="icon sun" /> }
        </div>
      </button>
    </div>
  );
}
