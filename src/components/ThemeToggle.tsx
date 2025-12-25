import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ThemeToggleProps {
  className?: string;
  size?: 'default' | 'large';
}

export const ThemeToggle = ({ className, size = 'default' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  const iconSize = size === 'large' ? 'h-5 w-5' : 'h-4 w-4';
  const buttonSize = size === 'large' ? 'h-12 w-12' : 'h-9 w-9';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn(
              buttonSize,
              "rounded-full transition-all",
              className
            )}
          >
            {theme === 'light' ? (
              <Moon className={iconSize} />
            ) : (
              <Sun className={iconSize} />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Switch to {theme === 'light' ? 'dark' : 'light'} mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

