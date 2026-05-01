import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Season } from "@/types/database"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns the calendar year of the *start* of the current US academic year.
 * The school year begins in August, so Aug-Dec returns the current year and
 * Jan-Jul returns the prior year. Example: in April 2026 → 2025 (the 2025-26
 * school year). All other date logic should derive from this to stay consistent.
 */
export function getAcademicYearStart(): number {
  const now = new Date()
  return now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1
}

/** Returns the current academic season based on the month. */
export function getCurrentSeason(): Season {
  const month = new Date().getMonth() // 0-indexed
  if (month >= 8 && month <= 10) return "Fall"    // Sep–Nov
  if (month === 11 || month <= 1) return "Winter"  // Dec–Feb
  if (month >= 2 && month <= 4) return "Spring"    // Mar–May
  return "Summer"                                   // Jun–Aug
}

/** Returns the current grade level (9–12) given a graduation year, or null if
 *  the student hasn't started high school yet. Switches to 9 seven days before
 *  their first day so they can prep. */
export function getCurrentGrade(
  graduationYear: number,
  schoolYearStartMonth = 7,
  schoolYearStartDay = 1,
): 9 | 10 | 11 | 12 | null {
  const academicYear = getAcademicYearStart()
  const grade = 12 - (graduationYear - academicYear - 1)
  if (grade < 9) {
    const hsStartYear = academicYear + 1
    const hsStart = new Date(hsStartYear, schoolYearStartMonth, schoolYearStartDay)
    const now = new Date()
    const msUntil = hsStart.getTime() - now.getTime()
    if (msUntil <= 7 * 24 * 60 * 60 * 1000) return 9
    return null
  }
  return Math.min(12, grade) as 9 | 10 | 11 | 12
}

/**
 * Graduation year choices for onboarding/settings, computed from today.
 * Range starts at the *current senior's* graduation year (academic-year start
 * + 1) and extends 6 years out. So in April 2026 you get 2026 (current senior
 * graduating in June) through 2032 (current ~5th grader planning ahead).
 * Recomputes on every call — never goes stale.
 */
export function getGraduationYearOptions(): number[] {
  const earliest = getAcademicYearStart() + 1
  return Array.from({ length: 7 }, (_, i) => earliest + i)
}
