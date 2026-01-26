
import { MilestoneTemplate, Season, CareerPath } from "@/types/database";

export const MILESTONES: Partial<MilestoneTemplate>[] = [
    // ==================== 9th Grade ====================
    // --- Fall (Aug-Sep) ---
    {
        title: "Meet with school counselor",
        description: "Discuss course rigor and 4-year plan.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Join 1-2 clubs or sports teams",
        description: "Start exploring your interests. Aim for one academic and one fun club.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 9,
        path_tags: []
    },
    {
        title: "Set academic goals for the semester",
        description: "Target GPA and study habits.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 8,
        path_tags: []
    },
    {
        title: "Create a study schedule",
        description: "Balance homework and activities.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 8,
        path_tags: []
    },
    // --- Fall (Oct-Nov) ---
    {
        title: "Attend club meetings regularly",
        description: "Consistency is key for future leadership.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 5,
        path_tags: []
    },
    {
        title: "Review progress report grades",
        description: "Identify areas for improvement early.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 6,
        path_tags: []
    },
    {
        title: "Start a reading list",
        description: "Build vocabulary and reading speed for potential college essays later.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 4,
        path_tags: ["Literature & Creative Writing", "Law & Political Science"]
    },
    // --- Winter (Dec-Jan) ---
    {
        title: "Prepare for mid-term exams",
        description: "Review study guides and notes.",
        grade_level: 9,
        season: "Winter",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Reflect on first semester achievements",
        description: "What went well? What needs work?",
        grade_level: 9,
        season: "Winter",
        urgency_score: 5,
        path_tags: []
    },
    {
        title: "Intro to Python/Java",
        description: "Take an online course or school elective to gauge interest.",
        grade_level: 9,
        season: "Winter",
        urgency_score: 6,
        path_tags: ["Computer Science", "Engineering (Mech/Civil/Elec)"]
    },
    {
        title: "Plan course selection for 10th grade",
        description: "Consider AP or Honors courses.",
        grade_level: 9,
        season: "Winter",
        urgency_score: 9,
        path_tags: []
    },
    // --- Spring (Feb-Mar) ---
    {
        title: "Finalize course requests for next year",
        description: "Submit forms to counselor.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Look for summer volunteer opportunities",
        description: "Or camps, workshops.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 7,
        path_tags: []
    },
    {
        title: "Focus on maintaining grades",
        description: "Difficult subjects may get harder.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 8,
        path_tags: []
    },
    // --- Spring (Apr-May) ---
    {
        title: "Prepare for final exams",
        description: "Finish the year strong.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Ask teachers for summer reading suggestions",
        description: "Keep your brain active.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 4,
        path_tags: []
    },
    {
        title: "Secure summer plans",
        description: "Volunteering, work, or camp.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 9,
        path_tags: []
    },
    // --- Summer ---
    {
        title: "Participate in planned summer activity",
        description: "Gain meaningful experience.",
        grade_level: 9,
        season: "Summer",
        urgency_score: 8,
        path_tags: []
    },
    {
        title: "Read 2-3 books",
        description: "Enjoyment and enrichment.",
        grade_level: 9,
        season: "Summer",
        urgency_score: 5,
        path_tags: []
    },
    {
        title: "Explore a new hobby or skill",
        description: "Coding, instrument, art, etc.",
        grade_level: 9,
        season: "Summer",
        urgency_score: 6,
        path_tags: []
    },

    // ==================== 10th Grade ====================
    // --- Fall (Aug-Sep) ---
    {
        title: "Take challenging courses",
        description: "Rigor is a key factor in admissions.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 9,
        path_tags: []
    },
    {
        title: "Seek leadership roles",
        description: "Move from member to leader in clubs.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Attend college fairs",
        description: "Start browsing options casually.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 7,
        path_tags: []
    },
    // --- Fall (Oct-Nov) ---
    {
        title: "Take the PSAT/NMSQT (Practice)",
        description: "Get familiar with the format.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 10, // Fixed Date
        path_tags: []
    },
    {
        title: "Analyze PSAT results",
        description: "Identify weak spots for next year.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 6, // Post-exam
        path_tags: []
    },
    {
        title: "Commit to community service",
        description: "Show dedication and impact.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 8,
        path_tags: []
    },
    // --- Winter (Dec-Jan) ---
    {
        title: "Moot Court / Debate",
        description: "Participate in a regional competition.",
        grade_level: 10,
        season: "Winter",
        urgency_score: 8,
        path_tags: ["Law & Political Science"]
    },
    {
        title: "Review academic performance",
        description: "Mid-sophomore year check-in.",
        grade_level: 10,
        season: "Winter",
        urgency_score: 7,
        path_tags: []
    },
    {
        title: "Discuss college budget",
        description: "Have 'The Talk' about costs early.",
        grade_level: 10,
        season: "Winter",
        urgency_score: 9,
        path_tags: []
    },
    {
        title: "Research summer programs",
        description: "Competitive programs for rising juniors have early deadlines.",
        grade_level: 10,
        season: "Winter",
        urgency_score: 9,
        path_tags: []
    },
    // --- Spring (Feb-Mar) ---
    {
        title: "Consider SAT/ACT practice test",
        description: "Baseline score assessment.",
        grade_level: 10,
        season: "Spring",
        urgency_score: 7,
        path_tags: []
    },
    {
        title: "Register for AP Exams",
        description: "Usually deadlines are in spring.",
        grade_level: 10,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Plan internships",
        description: "Work experience looks great.",
        grade_level: 10,
        season: "Spring",
        urgency_score: 8,
        path_tags: []
    },
    {
        title: "Build Portfolio Website",
        description: "Showcase projects and bio. Github Pages is free.",
        grade_level: 10,
        season: "Spring",
        urgency_score: 6,
        path_tags: ["Computer Science", "Visual Arts & Design"]
    },
    // --- Spring (Apr-May) ---
    {
        title: "Prepare for AP Exams/Finals",
        description: "Score well for college credit potential.",
        grade_level: 10,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Draft activity resume",
        description: "Compile everything you have done so far.",
        grade_level: 10,
        season: "Spring",
        urgency_score: 5,
        path_tags: []
    },
    {
        title: "Plan 11th grade course load",
        description: "Junior year is the hardest. Consult teachers.",
        grade_level: 10,
        season: "Spring",
        urgency_score: 9,
        path_tags: []
    },
    // --- Summer ---
    {
        title: "Visit college campuses (informal)",
        description: "Drive-by visits to see layouts.",
        grade_level: 10,
        season: "Summer",
        urgency_score: 6,
        path_tags: []
    },
    {
        title: "Read widely",
        description: "Prepare for junior year rigor.",
        grade_level: 10,
        season: "Summer",
        urgency_score: 5,
        path_tags: []
    },
    {
        title: "Volunteer or work",
        description: "Consistency matters.",
        grade_level: 10,
        season: "Summer",
        urgency_score: 8,
        path_tags: []
    },

    // ==================== 11th Grade ====================
    // --- Fall (Aug-Sep) ---
    {
        title: "Maintain high grades",
        description: "Junior year grades matter most. This is the most scrutinized year.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Leadership Position",
        description: "President, VP, or Project Lead in a club.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Create preliminary college list",
        description: "Reach, Match, and Safety schools.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 9,
        path_tags: []
    },
    {
        title: "Take SAT/ACT (Attempt 1)",
        description: "Establish a baseline score early if ready.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    // --- Fall (Oct-Nov) ---
    {
        title: "Take PSAT/NMSQT",
        description: "National Merit Qualifier. High scores yield scholarships.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Attend college rep visits",
        description: "Show demonstrated interest when they visit your school.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 7,
        path_tags: []
    },
    {
        title: "Prepare for winter SAT/ACT",
        description: "Study plan in motion.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 8,
        path_tags: []
    },
    // --- Winter (Dec-Jan) ---
    {
        title: "Analyze PSAT scores",
        description: "Refine testing strategy.",
        grade_level: 11,
        season: "Winter",
        urgency_score: 6,
        path_tags: []
    },
    {
        title: "Register for spring SAT/ACT",
        description: "Secure your seat.",
        grade_level: 11,
        season: "Winter",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Research College List (Deep Dive)",
        description: "Refine your list of 10-15 schools.",
        grade_level: 11,
        season: "Winter",
        urgency_score: 9,
        path_tags: []
    },
    {
        title: "Plan senior year courses",
        description: "Rigor is key. Don't slack off in 12th grade.",
        grade_level: 11,
        season: "Winter",
        urgency_score: 9,
        path_tags: []
    },
    // --- Spring (Feb-Mar) ---
    {
        title: "Identify recommenders",
        description: "Identify 2 teachers for Letters of Rec. Build relationships.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 9,
        path_tags: []
    },
    {
        title: "Take the SAT or ACT",
        description: "Official sitting.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Research scholarships",
        description: "Start a list of deadlines.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 7,
        path_tags: []
    },
    // --- Spring (Apr-May) ---
    {
        title: "Plan spring visits",
        description: "See campuses in session.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 8,
        path_tags: []
    },
    {
        title: "Brainstorm Essay Topics",
        description: "Find your unique story for the Common App.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 6,
        path_tags: []
    },
    {
        title: "Take AP Exams",
        description: "Essential for college credit.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Request Letters of Rec",
        description: "Ask formally before summer break to beat the fall rush.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Hospital Volunteering",
        description: "Secure a summer position for clinical hours.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 9,
        path_tags: ["Medicine & Health Sciences"]
    },
    // --- Summer ---
    {
        title: "Draft Common App Essay",
        description: "Write multiple drafts of your personal statement.",
        grade_level: 11,
        season: "Summer",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Finalize college list",
        description: "Know exactly where you apply (Safety, Target, Reach).",
        grade_level: 11,
        season: "Summer",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Create Common App account",
        description: "Opens Aug 1. Fill out the basics.",
        grade_level: 11,
        season: "Summer",
        urgency_score: 9,
        path_tags: []
    },
    {
        title: "Visit top-choice colleges",
        description: "Demonstrated interest.",
        grade_level: 11,
        season: "Summer",
        urgency_score: 8,
        path_tags: []
    },

    // ==================== 12th Grade ====================
    // --- Fall (Aug-Sep) ---
    {
        title: "Finalize Personal Statement",
        description: "Polished and proofread.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Request transcripts",
        description: "Follow school procedures to send to colleges.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Check in with recommenders",
        description: "Provide them with your resume/brag sheet.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 9,
        path_tags: []
    },
    {
        title: "Retake SAT/ACT",
        description: "Last chance for early apps.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 9,
        path_tags: []
    },
    // --- Fall (Oct-Nov) ---
    {
        title: "Submit Early Action/Decision",
        description: "Deadlines are usually Nov 1 or 15. Hit the button!",
        grade_level: 12,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Complete FAFSA/CSS Profile",
        description: "Financial aid is critical. Opens Oct 1.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Polish Regular Decision apps",
        description: "In case EA/ED doesn't work out.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 8,
        path_tags: []
    },
    // --- Winter (Dec-Jan) ---
    {
        title: "Submit Regular Decision apps",
        description: "Finish line for apps. Usually Jan 1 or 15.",
        grade_level: 12,
        season: "Winter",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Confirm materials received",
        description: "Check college portals to ensure nothing is missing.",
        grade_level: 12,
        season: "Winter",
        urgency_score: 9,
        path_tags: []
    },
    {
        title: "Avoid 'Senioritis'",
        description: "Colleges care about mid-year reports.",
        grade_level: 12,
        season: "Winter",
        urgency_score: 8,
        path_tags: []
    },
    // --- Spring (Feb-Mar) ---
    {
        title: "Monitor email for decisions",
        description: "Celebrate acceptances!",
        grade_level: 12,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Apply for local scholarships",
        description: "Every bit helps.",
        grade_level: 12,
        season: "Spring",
        urgency_score: 7,
        path_tags: []
    },
    {
        title: "Consider housing options",
        description: "Look ahead to dorm deposits.",
        grade_level: 12,
        season: "Spring",
        urgency_score: 6,
        path_tags: []
    },
    // --- Spring (Apr-May) ---
    {
        title: "Compare financial aid offers",
        description: "Calculate net cost.",
        grade_level: 12,
        season: "Spring",
        urgency_score: 9,
        path_tags: []
    },
    {
        title: "Attend admitted student days",
        description: "Get the vibe of the campus.",
        grade_level: 12,
        season: "Spring",
        urgency_score: 8,
        path_tags: []
    },
    {
        title: "Submit enrollment deposit",
        description: "May 1 is National Decision Day. Make your choice!",
        grade_level: 12,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        title: "Take AP Exams",
        description: "Finish strong for college credit.",
        grade_level: 12,
        season: "Spring",
        urgency_score: 9,
        path_tags: []
    }
];
