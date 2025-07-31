import { borderRadii, shadows, texts } from '@/tailwind.config';
import clsx, { type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

export { type ClassValue } from 'clsx';

export const twMergeConfig = {
  extend: {
    classGroups: {
      'font-size': [
        {
          text: Object.keys(texts),
        },
      ],
      shadow: [
        {
          shadow: Object.keys(shadows),
        },
      ],
      rounded: [
        {
          rounded: Object.keys(borderRadii),
        },
      ],
    },
  },
};

const customTwMerge = extendTailwindMerge(twMergeConfig);

/**
 * Utilizes `clsx` with `tailwind-merge`, use in cases of possible class conflicts.
 */
export function cn(...classes: ClassValue[]) {
  return customTwMerge(clsx(...classes));
}

/**
 * Extended version of cn that supports both variadic arguments and conditional classes with an object
 */
export function cnExt(...args: ClassValue[]): string;
export function cnExt(baseClasses: ClassValue, conditionalClasses?: Record<string, boolean>): string;
export function cnExt(...args: any[]): string {
  // New object-based conditional syntax: cnExt('base', { 'class': condition })
  if (args.length === 2 && typeof args[1] === 'object' && args[1] !== null && !Array.isArray(args[1]) && typeof args[1] !== 'string') {
    const [baseClasses, conditionalClasses] = args;
    const classes = [baseClasses];
    
    Object.entries(conditionalClasses).forEach(([className, condition]) => {
      if (condition) {
        classes.push(className);
      }
    });
    
    return cn(...classes);
  }
  
  // Legacy variadic syntax: cnExt('class1', 'class2', ...)
  return cn(...args);
}
