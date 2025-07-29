'use client';

import { Moon, Sun } from 'lucide-react';
import * as Button from '@/components/alignui/button';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

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