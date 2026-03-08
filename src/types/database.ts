
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
