import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export const fmt = (value: string) => new Intl.DateTimeFormat('nl-NL',{day:'numeric',month:'short'}).format(new Date(value));
