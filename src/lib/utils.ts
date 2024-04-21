import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToAscii(input: string) {
  //remove any non ASCII characters
  const asciiString = input.replace(/[^\x00-\x7F]+/g, "");
  return asciiString;
}
