'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as Button from '@/components/alignui/button';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!mounted) {
    // Return a placeholder that matches the expected size to prevent layout shift
    return (
      <Button.Root
        variant="neutral"
        mode="ghost"
        size="small"
        className="relative"
      >
        <Button.Icon 
          as={Sun}
          className="transition-transform duration-200 ease-out opacity-0"
        />
      </Button.Root>
    );
  }

  return (
    <Button.Root
      variant="neutral"
      mode="ghost"
      size="small"
      onClick={toggleTheme}
      className="relative"
    >
      <Button.Icon 
        as={resolvedTheme === 'light' ? Moon : Sun}
        className="transition-transform duration-200 ease-out"
      />
    </Button.Root>
  );
}