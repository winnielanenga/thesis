
'use server'

import { auth } from "@/auth"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { CourseType, LetterGrade, TermSeason } from "@/types/database"

const VALID_GRADES: LetterGrade[] = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F']
const VALID_TYPES: CourseType[] = ['Regular', 'Honors', 'AP/IB']
const VALID_SEASONS: TermSeason[] = ['Fall', 'Winter', 'Spring']

async function requireUserId(): Promise<string> {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")
    return session.user.id
}

export async function addCourse(input: {
    name: string
    type: CourseType
    credits: number
    term_season: TermSeason
    term_year: number
    grade?: LetterGrade | null
    grade_level?: 9 | 10 | 11 | 12 | null
}) {
    const userId = await requireUserId()

    if (!VALID_TYPES.includes(input.type)) throw new Error("Invalid course type")
    if (!VALID_SEASONS.includes(input.term_season)) throw new Error("Invalid term season")
    if (input.grade && !VALID_GRADES.includes(input.grade)) throw new Error("Invalid grade")
    if (input.credits <= 0 || input.credits > 10) throw new Error("Credits must be between 0 and 10")

    const { data, error } = await supabase
        .from('courses')
        .insert({
            user_id: userId,
            name: input.name.trim() || 'New Course',
            type: input.type,
            credits: input.credits,
            term_season: input.term_season,
            term_year: input.term_year,
            grade: input.grade ?? null,
            grade_level: input.grade_level ?? null,
        })
        .select()
        .single()

    if (error) throw new Error(error.message)
    revalidatePath('/academics')
    return data
}

export async function updateCourse(
    courseId: string,
    patch: Partial<{
        name: string
        type: CourseType
        grade: LetterGrade | null
        credits: number
        term_season: TermSeason
        term_year: number
        grade_level: 9 | 10 | 11 | 12 | null
    }>
) {
    const userId = await requireUserId()

    if (patch.type && !VALID_TYPES.includes(patch.type)) throw new Error("Invalid course type")
    if (patch.term_season && !VALID_SEASONS.includes(patch.term_season)) throw new Error("Invalid term season")
    if (patch.grade !== undefined && patch.grade !== null && !VALID_GRADES.includes(patch.grade)) {
        throw new Error("Invalid grade")
    }
    if (patch.credits !== undefined && (patch.credits <= 0 || patch.credits > 10)) {
        throw new Error("Credits must be between 0 and 10")
    }

    const { error } = await supabase
        .from('courses')
        .update(patch)
        .eq('id', courseId)
        .eq('user_id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/academics')
}

export async function deleteCourse(courseId: string) {
    const userId = await requireUserId()

    const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)
        .eq('user_id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/academics')
}

export async function addExam(input: {
    course_id: string
    exam_name: string
    date: string // YYYY-MM-DD
}) {
    const userId = await requireUserId()

    if (!input.course_id || !input.exam_name?.trim() || !input.date) {
        throw new Error("Missing exam fields")
    }

    // Verify course ownership before linking
    const { data: course, error: courseErr } = await supabase
        .from('courses')
        .select('id')
        .eq('id', input.course_id)
        .eq('user_id', userId)
        .single()

    if (courseErr || !course) throw new Error("Course not found")

    const { data, error } = await supabase
        .from('exams')
        .insert({
            user_id: userId,
            course_id: input.course_id,
            exam_name: input.exam_name.trim(),
            date: input.date,
        })
        .select()
        .single()

    if (error) throw new Error(error.message)
    revalidatePath('/academics')
    return data
}

export async function deleteExam(examId: string) {
    const userId = await requireUserId()

    const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', examId)
        .eq('user_id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/academics')
}

export async function setTargetGpa(targetGpa: number | null) {
    const userId = await requireUserId()

    if (targetGpa !== null && (targetGpa < 0 || targetGpa > 5)) {
        throw new Error("Target GPA must be between 0 and 5")
    }

    const { error } = await supabase
        .from('profiles')
        .update({ target_gpa: targetGpa })
        .eq('id', userId)

    if (error) throw new Error(error.message)
    revalidatePath('/academics')
    revalidatePath('/settings')
    revalidatePath('/dashboard')
}
