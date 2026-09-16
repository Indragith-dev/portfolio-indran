import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Returns a random element from an array
export const getRandomElement = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Sleep for a given number of milliseconds
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getStartValue = (value?: number) =>
  value && value > 50 ? value - 50 : 0;
