import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Season } from "@/types/database"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Returns the current academic season based on the month. */
export function getCurrentSeason(): Season {
  const month = new Date().getMonth() // 0-indexed
  if (month >= 8 && month <= 10) return "Fall"    // Sep–Nov
  if (month === 11 || month <= 1) return "Winter"  // Dec–Feb
  if (month >= 2 && month <= 4) return "Spring"    // Mar–May
  return "Summer"                                   // Jun–Aug
}

/** Returns the current grade level (9–12) given a graduation year. */
export function getCurrentGrade(graduationYear: number): number {
  const now = new Date()
  const academicYear = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1
  return Math.max(9, Math.min(12, 12 - (graduationYear - academicYear - 1)))
}
