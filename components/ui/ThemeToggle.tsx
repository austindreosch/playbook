'use client';

import { Moon, Sun } from 'lucide-react';
import * as Button from '@/components/alignui/button';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button.Root
      variant="neutral"
      mode="ghost"
      size="small"
      onClick={toggleTheme}
      className="relative"
    >
      <Button.Icon 
        as={theme === 'light' ? Moon : Sun}
        className="transition-transform duration-200 ease-out"
      />
    </Button.Root>
  );
}