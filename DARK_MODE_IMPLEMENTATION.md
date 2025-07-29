# Dark Mode Implementation Guide

## Overview
Dark mode has been implemented using CSS variables and a React context provider. The system leverages your existing AlignUI semantic color tokens, so **no component changes are needed** for most components.

## What's Included

### 1. Theme Provider (`contexts/ThemeContext.tsx`)
- Manages theme state (light/dark)
- Persists theme preference in localStorage
- Applies theme class to document root

### 2. Theme Toggle Component (`components/ui/ThemeToggle.tsx`)
- Simple button to toggle between light/dark themes
- Uses AlignUI button components
- Shows moon/sun icons based on current theme

### 3. Expanded CSS Variables (`app/globals.css`)
- Complete dark mode color mappings
- Inverted neutral color system for dark backgrounds
- Adjusted brand colors for better dark mode contrast
- All semantic tokens work automatically

### 4. Demo Page (`app/demo-dark-mode/page.tsx`)
- Shows roster components, widgets, and buttons in both themes
- Demonstrates that existing components work without modification

## Usage

### 1. Add Theme Provider to Your App
```jsx
// In your root layout or app component
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
```

### 2. Add Theme Toggle Anywhere
```jsx
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// In your header, settings menu, etc.
<ThemeToggle />
```

### 3. Use Semantic Colors (Already Working!)
Your existing components using semantic tokens automatically work:
```jsx
// These automatically adapt to dark mode:
<div className="bg-bg-white-0 text-text-strong-950">
<div className="bg-bg-weak-50 border-stroke-soft-200">
<Button variant="primary" mode="stroke">
```

## Color System

### Semantic Tokens (No Changes Needed)
- `bg-white-0`, `bg-weak-50`, `bg-soft-200` - Backgrounds
- `text-strong-950`, `text-sub-600`, `text-soft-400` - Text colors  
- `stroke-soft-200`, `stroke-strong-950` - Borders
- `information-base`, `success-base`, `error-base` - Brand colors

### Legacy Playbook Colors (Update These)
Replace these with semantic tokens for dark mode support:
- `bg-pb_backgroundgray` → `bg-bg-weak-50`
- `text-pb_darkgray` → `text-text-sub-600`
- `border-pb_lightgray` → `border-stroke-soft-200`

## Key Benefits

1. **Zero Component Changes**: AlignUI components automatically work
2. **Consistent**: All semantic colors follow the same dark mode logic
3. **Performant**: CSS variables enable instant theme switching
4. **Accessible**: Proper contrast ratios maintained in both themes
5. **Extensible**: Easy to add new colors or themes

## Demo
Visit `/demo-dark-mode` to see the implementation in action with your roster and widget components.

## Next Steps

1. Add `<ThemeProvider>` to your root layout
2. Place `<ThemeToggle />` in your header/navigation
3. Replace any remaining `pb_*` color classes with semantic tokens
4. Test your existing pages - they should work automatically!