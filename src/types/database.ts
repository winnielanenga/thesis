
export type CareerPath =
    | 'Law & Political Science'
    | 'Literature & Creative Writing'
    | 'Business Administration'
    | 'Economics & Finance'
    | 'Computer Science'
    | 'Engineering (Mech/Civil/Elec)'
    | 'Medicine & Health Sciences'
    | 'Psychology & Social Sciences'
    | 'Visual Arts & Design'
    | 'Architecture'
    | 'Undecided';

export type Season = 'Fall' | 'Winter' | 'Spring' | 'Summer';

export interface Profile {
    id: string; // Google OAuth 'sub' ID (TEXT, not UUID)
    full_name: string | null;
    graduation_year: number | null;
    career_path: CareerPath | null;
    target_gpa: number | null;
    dream_colleges: string[] | null;
    created_at: string;
}

export interface MilestoneTemplate {
    id: string;
    title: string;
    description: string | null;
    grade_level: 9 | 10 | 11 | 12;
    path_tags: CareerPath[] | null; // Empty means all paths
    season: Season | null;
    urgency_score: number; // 1-10
    created_at: string;
}

export interface UserMilestone {
    id: string;
    user_id: string;
    template_id: string;
    status: 'pending' | 'completed';
    assigned_month: number | null; // 0-11
    assigned_year: number | null;
    created_at: string;

    // Joined fields (optional)
    milestone_template?: MilestoneTemplate;
}

export interface Task {
    id: string;
    user_id: string;
    title: string;
    date: string; // YYYY-MM-DD
    completed: boolean;
    category: 'Academics' | 'Extracurricular' | 'College Prep' | 'Personal' | null;
    created_at: string;
}

export type CourseType = 'Regular' | 'Honors' | 'AP/IB';
export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
export type TermSeason = 'Fall' | 'Winter' | 'Spring';

export interface Course {
    id: string;
    user_id: string;
    name: string;
    type: CourseType;
    grade: LetterGrade | null;
    credits: number;
    term_season: TermSeason;
    term_year: number; // school-year start, e.g. 2025 = "2025-26"
    grade_level: 9 | 10 | 11 | 12 | null;
    created_at: string;
}

export interface Exam {
    id: string;
    user_id: string;
    course_id: string;
    exam_name: string;
    date: string; // YYYY-MM-DD
    created_at: string;
}

export type EssayType = 'Common App' | 'Supplemental' | 'Scholarship' | 'Other';
export type EssayStatus = 'Not Started' | 'Drafting' | 'Reviewing' | 'Submitted';

export interface Essay {
    id: string;
    user_id: string;
    title: string;
    school: string | null;
    type: EssayType;
    prompt: string | null;
    word_limit: number | null;
    status: EssayStatus;
    deadline: string | null; // YYYY-MM-DD
    notes: string | null;
    created_at: string;
}
