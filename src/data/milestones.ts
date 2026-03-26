
import { MilestoneTemplate, Season, CareerPath } from "@/types/database";

export const MILESTONES: (Partial<MilestoneTemplate> & { id: string })[] = [
    // ==================== 9th Grade ====================
    // --- Fall (Aug-Sep) ---
    {
        id: "9-fall-meet-with-school-counselor",
        title: "Meet with school counselor",
        description: "Discuss course rigor and 4-year plan.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "9-fall-join-clubs-or-sports",
        title: "Join 1-2 clubs or sports teams",
        description: "Start exploring your interests. Aim for one academic and one fun club.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 9,
        path_tags: []
    },
    {
        id: "9-fall-set-academic-goals",
        title: "Set academic goals for the semester",
        description: "Target GPA and study habits.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 8,
        path_tags: []
    },
    {
        id: "9-fall-create-study-schedule",
        title: "Create a study schedule",
        description: "Balance homework and activities.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 8,
        path_tags: []
    },
    // Path-specific: 9th Fall
    {
        id: "9-fall-join-debate-club",
        title: "Join Debate Club or Speech & Debate",
        description: "Build argumentation and public speaking skills early.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 8,
        path_tags: ["Law & Political Science"]
    },
    {
        id: "9-fall-join-model-un",
        title: "Join Model United Nations",
        description: "Learn about international relations, diplomacy, and public policy.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 7,
        path_tags: ["Law & Political Science", "Economics & Finance"]
    },
    {
        id: "9-fall-join-literary-magazine",
        title: "Join the school literary magazine",
        description: "Start contributing poems, stories, or essays.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 7,
        path_tags: ["Literature & Creative Writing"]
    },
    {
        id: "9-fall-join-deca-fbla",
        title: "Join DECA or FBLA",
        description: "Business and entrepreneurship clubs build foundational skills.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 7,
        path_tags: ["Business Administration", "Economics & Finance"]
    },
    {
        id: "9-fall-join-robotics-team",
        title: "Join the Robotics Team",
        description: "Hands-on engineering, programming, and teamwork.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 8,
        path_tags: ["Engineering (Mech/Civil/Elec)", "Computer Science"]
    },
    {
        id: "9-fall-join-science-olympiad",
        title: "Join Science Olympiad",
        description: "Compete in science and engineering events to explore STEM fields.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 7,
        path_tags: ["Engineering (Mech/Civil/Elec)", "Medicine & Health Sciences"]
    },
    {
        id: "9-fall-join-psychology-club",
        title: "Join Psychology Club or Peer Mentoring",
        description: "Explore behavioral science and develop empathy skills.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 6,
        path_tags: ["Psychology & Social Sciences"]
    },
    {
        id: "9-fall-start-sketchbook",
        title: "Start a daily sketchbook practice",
        description: "Build drawing fundamentals and develop a creative habit.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 7,
        path_tags: ["Visual Arts & Design", "Architecture"]
    },
    {
        id: "9-fall-take-art-elective",
        title: "Enroll in a studio art or design elective",
        description: "Foundation drawing, painting, or digital art course.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 7,
        path_tags: ["Visual Arts & Design"]
    },
    {
        id: "9-fall-explore-architecture",
        title: "Explore architecture through observation",
        description: "Sketch local buildings and learn basic architectural vocabulary.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 5,
        path_tags: ["Architecture"]
    },
    // --- Fall (Oct-Nov) ---
    {
        id: "9-fall-attend-club-meetings",
        title: "Attend club meetings regularly",
        description: "Consistency is key for future leadership.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 5,
        path_tags: []
    },
    {
        id: "9-fall-review-progress-reports",
        title: "Review progress report grades",
        description: "Identify areas for improvement early.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 6,
        path_tags: []
    },
    {
        id: "9-fall-start-reading-list",
        title: "Start a reading list",
        description: "Build vocabulary and reading speed for potential college essays later.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 4,
        path_tags: ["Literature & Creative Writing", "Law & Political Science"]
    },
    {
        id: "9-fall-explore-coding-basics",
        title: "Explore coding basics online",
        description: "Try free platforms like Codecademy, Khan Academy, or freeCodeCamp.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 6,
        path_tags: ["Computer Science"]
    },
    {
        id: "9-fall-shadow-a-doctor",
        title: "Shadow a doctor or healthcare professional",
        description: "Observe a clinical environment to see if medicine interests you.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 5,
        path_tags: ["Medicine & Health Sciences"]
    },
    {
        id: "9-fall-stock-market-game",
        title: "Play a stock market simulation game",
        description: "Learn basics of investing and markets through a virtual portfolio.",
        grade_level: 9,
        season: "Fall",
        urgency_score: 5,
        path_tags: ["Economics & Finance", "Business Administration"]
    },
    // --- Winter (Dec-Jan) ---
    {
        id: "9-winter-prepare-midterms",
        title: "Prepare for mid-term exams",
        description: "Review study guides and notes.",
        grade_level: 9,
        season: "Winter",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "9-winter-reflect-first-semester",
        title: "Reflect on first semester achievements",
        description: "What went well? What needs work?",
        grade_level: 9,
        season: "Winter",
        urgency_score: 5,
        path_tags: []
    },
    {
        id: "9-winter-intro-programming",
        title: "Intro to Python/Java",
        description: "Take an online course or school elective to gauge interest.",
        grade_level: 9,
        season: "Winter",
        urgency_score: 6,
        path_tags: ["Computer Science", "Engineering (Mech/Civil/Elec)"]
    },
    {
        id: "9-winter-plan-10th-courses",
        title: "Plan course selection for 10th grade",
        description: "Consider AP or Honors courses.",
        grade_level: 9,
        season: "Winter",
        urgency_score: 9,
        path_tags: []
    },
    {
        id: "9-winter-read-constitutional-law",
        title: "Read an intro to constitutional law or famous court cases",
        description: "Try 'We the Students' or summaries of landmark Supreme Court decisions.",
        grade_level: 9,
        season: "Winter",
        urgency_score: 4,
        path_tags: ["Law & Political Science"]
    },
    {
        id: "9-winter-creative-writing-journal",
        title: "Start a creative writing journal",
        description: "Write short stories, poems, or essays regularly to develop your voice.",
        grade_level: 9,
        season: "Winter",
        urgency_score: 5,
        path_tags: ["Literature & Creative Writing"]
    },
    {
        id: "9-winter-learn-digital-art-tools",
        title: "Learn a digital art tool",
        description: "Explore Procreate, Photoshop, or free tools like Krita.",
        grade_level: 9,
        season: "Winter",
        urgency_score: 5,
        path_tags: ["Visual Arts & Design", "Architecture"]
    },
    {
        id: "9-winter-biology-deep-dive",
        title: "Explore biology beyond the classroom",
        description: "Watch medical documentaries, read about anatomy, or explore Khan Academy biology.",
        grade_level: 9,
        season: "Winter",
        urgency_score: 5,
        path_tags: ["Medicine & Health Sciences"]
    },
    {
        id: "9-winter-intro-psychology-reading",
        title: "Read an intro psychology book",
        description: "Try 'Thinking, Fast and Slow' (simplified) or psychology podcasts.",
        grade_level: 9,
        season: "Winter",
        urgency_score: 4,
        path_tags: ["Psychology & Social Sciences"]
    },
    // --- Spring (Feb-Mar) ---
    {
        id: "9-spring-finalize-course-requests",
        title: "Finalize course requests for next year",
        description: "Submit forms to counselor.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "9-spring-summer-volunteer",
        title: "Look for summer volunteer opportunities",
        description: "Or camps, workshops.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 7,
        path_tags: []
    },
    {
        id: "9-spring-maintain-grades",
        title: "Focus on maintaining grades",
        description: "Difficult subjects may get harder.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 8,
        path_tags: []
    },
    {
        id: "9-spring-first-coding-project",
        title: "Build your first coding project",
        description: "A simple website, calculator app, or text-based game.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 6,
        path_tags: ["Computer Science"]
    },
    {
        id: "9-spring-enter-writing-contest",
        title: "Enter a writing contest",
        description: "Scholastic Art & Writing Awards or local competitions.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 6,
        path_tags: ["Literature & Creative Writing"]
    },
    {
        id: "9-spring-deca-fbla-competition",
        title: "Compete in a DECA or FBLA regional event",
        description: "Practice business presentations and case studies.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 7,
        path_tags: ["Business Administration"]
    },
    {
        id: "9-spring-engineering-challenge",
        title: "Participate in an engineering design challenge",
        description: "Bridge building, egg drop, or a maker project at school.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 6,
        path_tags: ["Engineering (Mech/Civil/Elec)"]
    },
    {
        id: "9-spring-submit-art-to-show",
        title: "Submit artwork to a school or local art show",
        description: "Start building exhibition experience early.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 6,
        path_tags: ["Visual Arts & Design"]
    },
    {
        id: "9-spring-volunteer-clinic-hospital",
        title: "Apply for summer clinical volunteering",
        description: "Hospitals and clinics often require early applications for teen volunteers.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 7,
        path_tags: ["Medicine & Health Sciences"]
    },
    // --- Spring (Apr-May) ---
    {
        id: "9-spring-prepare-finals",
        title: "Prepare for final exams",
        description: "Finish the year strong.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "9-spring-summer-reading",
        title: "Ask teachers for summer reading suggestions",
        description: "Keep your brain active.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 4,
        path_tags: []
    },
    {
        id: "9-spring-secure-summer-plans",
        title: "Secure summer plans",
        description: "Volunteering, work, or camp.",
        grade_level: 9,
        season: "Spring",
        urgency_score: 9,
        path_tags: []
    },
    // --- Summer ---
    {
        id: "9-summer-planned-activity",
        title: "Participate in planned summer activity",
        description: "Gain meaningful experience.",
        grade_level: 9,
        season: "Summer",
        urgency_score: 8,
        path_tags: []
    },
    {
        id: "9-summer-read-books",
        title: "Read 2-3 books",
        description: "Enjoyment and enrichment.",
        grade_level: 9,
        season: "Summer",
        urgency_score: 5,
        path_tags: []
    },
    {
        id: "9-summer-explore-hobby",
        title: "Explore a new hobby or skill",
        description: "Coding, instrument, art, etc.",
        grade_level: 9,
        season: "Summer",
        urgency_score: 6,
        path_tags: []
    },
    {
        id: "9-summer-mock-trial-camp",
        title: "Attend a mock trial or debate summer camp",
        description: "Intensive programs build skills and look great on applications.",
        grade_level: 9,
        season: "Summer",
        urgency_score: 6,
        path_tags: ["Law & Political Science"]
    },
    {
        id: "9-summer-creative-writing-workshop",
        title: "Attend a creative writing workshop or camp",
        description: "Many universities and community centers offer teen writing programs.",
        grade_level: 9,
        season: "Summer",
        urgency_score: 6,
        path_tags: ["Literature & Creative Writing"]
    },
    {
        id: "9-summer-coding-camp",
        title: "Attend a coding camp or complete an online course",
        description: "Build programming skills during the break. Try CS50 or a bootcamp.",
        grade_level: 9,
        season: "Summer",
        urgency_score: 7,
        path_tags: ["Computer Science"]
    },
    {
        id: "9-summer-engineering-camp",
        title: "Attend an engineering or maker camp",
        description: "Hands-on building, 3D printing, or robotics.",
        grade_level: 9,
        season: "Summer",
        urgency_score: 6,
        path_tags: ["Engineering (Mech/Civil/Elec)"]
    },
    {
        id: "9-summer-business-lemonade",
        title: "Start a small business or side project",
        description: "Lawn care, tutoring, Etsy shop, or a simple online venture.",
        grade_level: 9,
        season: "Summer",
        urgency_score: 5,
        path_tags: ["Business Administration"]
    },
    {
        id: "9-summer-econ-reading",
        title: "Read an intro economics book",
        description: "Try 'Freakonomics' or 'Naked Economics' to explore the field.",
        grade_level: 9,
        season: "Summer",
        urgency_score: 4,
        path_tags: ["Economics & Finance"]
    },
    {
        id: "9-summer-clinical-volunteering",
        title: "Volunteer at a hospital or clinic",
        description: "Begin accumulating clinical hours and see healthcare up close.",
        grade_level: 9,
        season: "Summer",
        urgency_score: 7,
        path_tags: ["Medicine & Health Sciences"]
    },
    {
        id: "9-summer-psychology-documentary",
        title: "Watch psychology documentaries or read case studies",
        description: "Explore topics like memory, perception, and social behavior.",
        grade_level: 9,
        season: "Summer",
        urgency_score: 4,
        path_tags: ["Psychology & Social Sciences"]
    },
    {
        id: "9-summer-art-portfolio-start",
        title: "Begin building an art portfolio",
        description: "Collect your best pieces and start thinking about a cohesive body of work.",
        grade_level: 9,
        season: "Summer",
        urgency_score: 6,
        path_tags: ["Visual Arts & Design"]
    },
    {
        id: "9-summer-architecture-sketching",
        title: "Sketch buildings and learn basic drafting",
        description: "Practice architectural drawing and explore free CAD tools like SketchUp.",
        grade_level: 9,
        season: "Summer",
        urgency_score: 5,
        path_tags: ["Architecture"]
    },

    // ==================== 10th Grade ====================
    // --- Fall (Aug-Sep) ---
    {
        id: "10-fall-challenging-courses",
        title: "Take challenging courses",
        description: "Rigor is a key factor in admissions.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 9,
        path_tags: []
    },
    {
        id: "10-fall-seek-leadership",
        title: "Seek leadership roles",
        description: "Move from member to leader in clubs.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "10-fall-college-fairs",
        title: "Attend college fairs",
        description: "Start browsing options casually.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 7,
        path_tags: []
    },
    // Path-specific: 10th Fall
    {
        id: "10-fall-debate-competition",
        title: "Compete in a debate tournament",
        description: "Regional or invitational tournaments. Track your wins and records.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 8,
        path_tags: ["Law & Political Science"]
    },
    {
        id: "10-fall-nanowrimo",
        title: "Participate in NaNoWriMo (National Novel Writing Month)",
        description: "Write a 50,000-word novel in November. Great for discipline and creativity.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 6,
        path_tags: ["Literature & Creative Writing"]
    },
    {
        id: "10-fall-usaco-intro",
        title: "Register for USACO (USA Computing Olympiad)",
        description: "Start competing in Bronze division. Great for CS college apps.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 7,
        path_tags: ["Computer Science"]
    },
    {
        id: "10-fall-robotics-competition-prep",
        title: "Prepare for robotics competition season",
        description: "FRC, FTC, or VEX. Design and build phase begins in the fall.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 8,
        path_tags: ["Engineering (Mech/Civil/Elec)"]
    },
    {
        id: "10-fall-business-plan-draft",
        title: "Draft a business plan",
        description: "Develop a concept for a DECA or FBLA business plan competition.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 6,
        path_tags: ["Business Administration"]
    },
    {
        id: "10-fall-econ-challenge-prep",
        title: "Prepare for the National Economics Challenge",
        description: "Study micro and macroeconomics concepts for competition.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 6,
        path_tags: ["Economics & Finance"]
    },
    {
        id: "10-fall-biology-olympiad-prep",
        title: "Start preparing for Biology Olympiad (USABO)",
        description: "Study Campbell Biology and practice exams for the open exam in February.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 7,
        path_tags: ["Medicine & Health Sciences"]
    },
    {
        id: "10-fall-social-science-research",
        title: "Begin a social science research project",
        description: "Design a survey or observational study on a topic that interests you.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 6,
        path_tags: ["Psychology & Social Sciences"]
    },
    {
        id: "10-fall-art-competition-entry",
        title: "Enter an art competition",
        description: "Scholastic Art Awards, Congressional Art Competition, or local shows.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 7,
        path_tags: ["Visual Arts & Design"]
    },
    {
        id: "10-fall-intro-cad-drafting",
        title: "Take an intro to CAD or drafting course",
        description: "Learn AutoCAD, Revit, or SketchUp through school or online.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 7,
        path_tags: ["Architecture", "Engineering (Mech/Civil/Elec)"]
    },
    // --- Fall (Oct-Nov) ---
    {
        id: "10-fall-psat-practice",
        title: "Take the PSAT/NMSQT (Practice)",
        description: "Get familiar with the format.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "10-fall-analyze-psat",
        title: "Analyze PSAT results",
        description: "Identify weak spots for next year.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 6,
        path_tags: []
    },
    {
        id: "10-fall-community-service",
        title: "Commit to community service",
        description: "Show dedication and impact.",
        grade_level: 10,
        season: "Fall",
        urgency_score: 8,
        path_tags: []
    },
    // --- Winter (Dec-Jan) ---
    {
        id: "10-winter-moot-court",
        title: "Moot Court / Debate",
        description: "Participate in a regional competition.",
        grade_level: 10,
        season: "Winter",
        urgency_score: 8,
        path_tags: ["Law & Political Science"]
    },
    {
        id: "10-winter-review-performance",
        title: "Review academic performance",
        description: "Mid-sophomore year check-in.",
        grade_level: 10,
        season: "Winter",
        urgency_score: 7,
        path_tags: []
    },
    {
        id: "10-winter-college-budget",
        title: "Discuss college budget",
        description: "Have 'The Talk' about costs early.",
        grade_level: 10,
        season: "Winter",
        urgency_score: 9,
        path_tags: []
    },
    {
        id: "10-winter-summer-programs",
        title: "Research summer programs",
        description: "Competitive programs for rising juniors have early deadlines.",
        grade_level: 10,
        season: "Winter",
        urgency_score: 9,
        path_tags: []
    },
    {
        id: "10-winter-hackathon",
        title: "Participate in a hackathon",
        description: "Build a project in 24-48 hours with a team. Great for portfolio and networking.",
        grade_level: 10,
        season: "Winter",
        urgency_score: 7,
        path_tags: ["Computer Science", "Engineering (Mech/Civil/Elec)"]
    },
    {
        id: "10-winter-literary-submission",
        title: "Submit writing to literary journals or magazines",
        description: "Teen Ink, Polyphony Lit, or school publications.",
        grade_level: 10,
        season: "Winter",
        urgency_score: 6,
        path_tags: ["Literature & Creative Writing"]
    },
    {
        id: "10-winter-econ-competition",
        title: "Compete in an economics competition",
        description: "National Economics Challenge, Fed Challenge, or Essay Contest.",
        grade_level: 10,
        season: "Winter",
        urgency_score: 7,
        path_tags: ["Economics & Finance"]
    },
    {
        id: "10-winter-anatomy-physiology",
        title: "Study anatomy and physiology independently",
        description: "Supplement with online courses or textbooks to prepare for AP Bio.",
        grade_level: 10,
        season: "Winter",
        urgency_score: 5,
        path_tags: ["Medicine & Health Sciences"]
    },
    {
        id: "10-winter-psychology-research-reading",
        title: "Read psychology research papers",
        description: "Explore APA journals for teens or popular psychology research summaries.",
        grade_level: 10,
        season: "Winter",
        urgency_score: 5,
        path_tags: ["Psychology & Social Sciences"]
    },
    {
        id: "10-winter-portfolio-review",
        title: "Get a portfolio review from an art teacher or mentor",
        description: "Feedback helps you identify strengths and areas to develop.",
        grade_level: 10,
        season: "Winter",
        urgency_score: 6,
        path_tags: ["Visual Arts & Design"]
    },
    {
        id: "10-winter-architecture-history",
        title: "Study architectural history and styles",
        description: "Learn about major movements: Classical, Gothic, Modernism, Brutalism, etc.",
        grade_level: 10,
        season: "Winter",
        urgency_score: 5,
        path_tags: ["Architecture"]
    },
    {
        id: "10-winter-deca-fbla-regionals",
        title: "Compete at DECA/FBLA regionals",
        description: "Present your business plan or compete in role-play events.",
        grade_level: 10,
        season: "Winter",
        urgency_score: 8,
        path_tags: ["Business Administration"]
    },
    // --- Spring (Feb-Mar) ---
    {
        id: "10-spring-sat-act-practice",
        title: "Consider SAT/ACT practice test",
        description: "Baseline score assessment.",
        grade_level: 10,
        season: "Spring",
        urgency_score: 7,
        path_tags: []
    },
    {
        id: "10-spring-register-ap",
        title: "Register for AP Exams",
        description: "Usually deadlines are in spring.",
        grade_level: 10,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "10-spring-plan-internships",
        title: "Plan internships",
        description: "Work experience looks great.",
        grade_level: 10,
        season: "Spring",
        urgency_score: 8,
        path_tags: []
    },
    {
        id: "10-spring-portfolio-website",
        title: "Build Portfolio Website",
        description: "Showcase projects and bio. Github Pages is free.",
        grade_level: 10,
        season: "Spring",
        urgency_score: 6,
        path_tags: ["Computer Science", "Visual Arts & Design"]
    },
    {
        id: "10-spring-model-un-conference",
        title: "Attend a Model UN conference",
        description: "Regional or national conferences build diplomacy and research skills.",
        grade_level: 10,
        season: "Spring",
        urgency_score: 7,
        path_tags: ["Law & Political Science"]
    },
    {
        id: "10-spring-science-fair-project",
        title: "Complete a science fair project",
        description: "Design and execute an original experiment for regional competition.",
        grade_level: 10,
        season: "Spring",
        urgency_score: 7,
        path_tags: ["Engineering (Mech/Civil/Elec)", "Medicine & Health Sciences", "Psychology & Social Sciences"]
    },
    {
        id: "10-spring-architecture-design-comp",
        title: "Enter a design or architecture competition",
        description: "Future City Competition, ACE Mentor Program, or similar.",
        grade_level: 10,
        season: "Spring",
        urgency_score: 6,
        path_tags: ["Architecture"]
    },
    // --- Spring (Apr-May) ---
    {
        id: "10-spring-ap-finals",
        title: "Prepare for AP Exams/Finals",
        description: "Score well for college credit potential.",
        grade_level: 10,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "10-spring-activity-resume",
        title: "Draft activity resume",
        description: "Compile everything you have done so far.",
        grade_level: 10,
        season: "Spring",
        urgency_score: 5,
        path_tags: []
    },
    {
        id: "10-spring-plan-11th-courses",
        title: "Plan 11th grade course load",
        description: "Junior year is the hardest. Consult teachers.",
        grade_level: 10,
        season: "Spring",
        urgency_score: 9,
        path_tags: []
    },
    // --- Summer ---
    {
        id: "10-summer-campus-visits",
        title: "Visit college campuses (informal)",
        description: "Drive-by visits to see layouts.",
        grade_level: 10,
        season: "Summer",
        urgency_score: 6,
        path_tags: []
    },
    {
        id: "10-summer-read-widely",
        title: "Read widely",
        description: "Prepare for junior year rigor.",
        grade_level: 10,
        season: "Summer",
        urgency_score: 5,
        path_tags: []
    },
    {
        id: "10-summer-volunteer-work",
        title: "Volunteer or work",
        description: "Consistency matters.",
        grade_level: 10,
        season: "Summer",
        urgency_score: 8,
        path_tags: []
    },
    {
        id: "10-summer-pre-law-program",
        title: "Attend a pre-law or government summer program",
        description: "Programs like Boys/Girls State, law school summer camps, or Congressional internships.",
        grade_level: 10,
        season: "Summer",
        urgency_score: 7,
        path_tags: ["Law & Political Science"]
    },
    {
        id: "10-summer-writing-intensive",
        title: "Attend a summer writing intensive or workshop",
        description: "Iowa Young Writers' Studio, Kenyon Review, or similar programs.",
        grade_level: 10,
        season: "Summer",
        urgency_score: 7,
        path_tags: ["Literature & Creative Writing"]
    },
    {
        id: "10-summer-build-cs-project",
        title: "Build a significant coding project",
        description: "A web app, mobile app, or game. Push it to GitHub.",
        grade_level: 10,
        season: "Summer",
        urgency_score: 8,
        path_tags: ["Computer Science"]
    },
    {
        id: "10-summer-engineering-program",
        title: "Attend an engineering summer program",
        description: "University-hosted programs like MITES, COSMOS, or similar.",
        grade_level: 10,
        season: "Summer",
        urgency_score: 7,
        path_tags: ["Engineering (Mech/Civil/Elec)"]
    },
    {
        id: "10-summer-business-internship",
        title: "Pursue a business internship or start a venture",
        description: "Shadow an entrepreneur, intern at a local business, or scale your own project.",
        grade_level: 10,
        season: "Summer",
        urgency_score: 7,
        path_tags: ["Business Administration"]
    },
    {
        id: "10-summer-econ-research",
        title: "Do independent economics research",
        description: "Analyze a local economic issue or write an economics essay for a competition.",
        grade_level: 10,
        season: "Summer",
        urgency_score: 6,
        path_tags: ["Economics & Finance"]
    },
    {
        id: "10-summer-research-internship-med",
        title: "Apply for a research internship in a lab",
        description: "University labs sometimes accept high school students for summer research.",
        grade_level: 10,
        season: "Summer",
        urgency_score: 8,
        path_tags: ["Medicine & Health Sciences", "Psychology & Social Sciences"]
    },
    {
        id: "10-summer-art-intensive",
        title: "Attend a pre-college art intensive program",
        description: "RISD, Pratt, MICA, or other schools offer summer programs for high schoolers.",
        grade_level: 10,
        season: "Summer",
        urgency_score: 7,
        path_tags: ["Visual Arts & Design"]
    },
    {
        id: "10-summer-architecture-camp",
        title: "Attend an architecture summer camp",
        description: "Programs at schools like Cornell, Notre Dame, or local AIA chapters.",
        grade_level: 10,
        season: "Summer",
        urgency_score: 7,
        path_tags: ["Architecture"]
    },

    // ==================== 11th Grade ====================
    // --- Fall (Aug-Sep) ---
    {
        id: "11-fall-maintain-grades",
        title: "Maintain high grades",
        description: "Junior year grades matter most. This is the most scrutinized year.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "11-fall-leadership-position",
        title: "Leadership Position",
        description: "President, VP, or Project Lead in a club.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "11-fall-college-list",
        title: "Create preliminary college list",
        description: "Reach, Match, and Safety schools.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 9,
        path_tags: []
    },
    {
        id: "11-fall-sat-act-attempt1",
        title: "Take SAT/ACT (Attempt 1)",
        description: "Establish a baseline score early if ready.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    // Path-specific: 11th Fall
    {
        id: "11-fall-lead-debate-mock-trial",
        title: "Take a leadership role in Debate or Mock Trial",
        description: "Captain or lead attorney position. Compete at state-level tournaments.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 9,
        path_tags: ["Law & Political Science"]
    },
    {
        id: "11-fall-submit-literary-work",
        title: "Submit work to national literary publications",
        description: "Adroit Journal, The Apprentice Writer, or Kenyon Review. Build your publication list.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 7,
        path_tags: ["Literature & Creative Writing"]
    },
    {
        id: "11-fall-open-source-contribution",
        title: "Contribute to an open source project",
        description: "Find beginner-friendly issues on GitHub. Shows real-world collaboration.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 7,
        path_tags: ["Computer Science"]
    },
    {
        id: "11-fall-lead-robotics-engineering",
        title: "Lead a robotics or engineering team project",
        description: "Take a design lead or project manager role for competition season.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 8,
        path_tags: ["Engineering (Mech/Civil/Elec)"]
    },
    {
        id: "11-fall-deca-fbla-officer",
        title: "Serve as a DECA/FBLA chapter officer",
        description: "Lead meetings, organize events, and mentor younger members.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 8,
        path_tags: ["Business Administration"]
    },
    {
        id: "11-fall-fed-challenge-prep",
        title: "Prepare for the Federal Reserve Challenge",
        description: "Teams present monetary policy analysis to Federal Reserve economists.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 7,
        path_tags: ["Economics & Finance"]
    },
    {
        id: "11-fall-research-mentor",
        title: "Find a research mentor at a local university",
        description: "Email professors whose research interests you. Offer to assist in their lab.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 8,
        path_tags: ["Medicine & Health Sciences", "Psychology & Social Sciences"]
    },
    {
        id: "11-fall-portfolio-development",
        title: "Develop a cohesive art portfolio theme",
        description: "Start curating 12-20 pieces around a central concept or style for applications.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 9,
        path_tags: ["Visual Arts & Design"]
    },
    {
        id: "11-fall-architecture-portfolio-start",
        title: "Begin your architecture portfolio",
        description: "Collect design work, sketches, models, and CAD projects for applications.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 8,
        path_tags: ["Architecture"]
    },
    // --- Fall (Oct-Nov) ---
    {
        id: "11-fall-psat-nmsqt",
        title: "Take PSAT/NMSQT",
        description: "National Merit Qualifier. High scores yield scholarships.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "11-fall-college-rep-visits",
        title: "Attend college rep visits",
        description: "Show demonstrated interest when they visit your school.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 7,
        path_tags: []
    },
    {
        id: "11-fall-prep-winter-sat",
        title: "Prepare for winter SAT/ACT",
        description: "Study plan in motion.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 8,
        path_tags: []
    },
    {
        id: "11-fall-usaco-silver-gold",
        title: "Advance in USACO to Silver or Gold division",
        description: "Consistent practice with competitive programming problems.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 7,
        path_tags: ["Computer Science"]
    },
    {
        id: "11-fall-nanowrimo-advanced",
        title: "Complete NaNoWriMo with a polished draft",
        description: "Use November to produce a substantial creative writing piece.",
        grade_level: 11,
        season: "Fall",
        urgency_score: 5,
        path_tags: ["Literature & Creative Writing"]
    },
    // --- Winter (Dec-Jan) ---
    {
        id: "11-winter-analyze-psat",
        title: "Analyze PSAT scores",
        description: "Refine testing strategy.",
        grade_level: 11,
        season: "Winter",
        urgency_score: 6,
        path_tags: []
    },
    {
        id: "11-winter-register-spring-sat",
        title: "Register for spring SAT/ACT",
        description: "Secure your seat.",
        grade_level: 11,
        season: "Winter",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "11-winter-college-list-deep-dive",
        title: "Research College List (Deep Dive)",
        description: "Refine your list of 10-15 schools.",
        grade_level: 11,
        season: "Winter",
        urgency_score: 9,
        path_tags: []
    },
    {
        id: "11-winter-plan-senior-courses",
        title: "Plan senior year courses",
        description: "Rigor is key. Don't slack off in 12th grade.",
        grade_level: 11,
        season: "Winter",
        urgency_score: 9,
        path_tags: []
    },
    {
        id: "11-winter-state-debate-tournament",
        title: "Compete at state-level debate or mock trial",
        description: "Qualifying for state or national competition is a major credential.",
        grade_level: 11,
        season: "Winter",
        urgency_score: 8,
        path_tags: ["Law & Political Science"]
    },
    {
        id: "11-winter-deca-fbla-state",
        title: "Compete at DECA/FBLA state competition",
        description: "Qualifying for nationals is a standout achievement.",
        grade_level: 11,
        season: "Winter",
        urgency_score: 8,
        path_tags: ["Business Administration"]
    },
    {
        id: "11-winter-build-app-or-tool",
        title: "Build a substantial app or tool",
        description: "Something that solves a real problem. Document it well for your portfolio.",
        grade_level: 11,
        season: "Winter",
        urgency_score: 8,
        path_tags: ["Computer Science"]
    },
    {
        id: "11-winter-usabo-open-exam",
        title: "Take the USABO Open Exam",
        description: "USA Biology Olympiad first round. Strong performance opens doors.",
        grade_level: 11,
        season: "Winter",
        urgency_score: 8,
        path_tags: ["Medicine & Health Sciences"]
    },
    {
        id: "11-winter-social-science-fair",
        title: "Present at a social science or psychology fair",
        description: "ISEF, state science fair, or behavioral science symposium.",
        grade_level: 11,
        season: "Winter",
        urgency_score: 7,
        path_tags: ["Psychology & Social Sciences"]
    },
    {
        id: "11-winter-gallery-exhibition",
        title: "Exhibit work in a gallery or show",
        description: "Local galleries, community centers, or curated high school exhibitions.",
        grade_level: 11,
        season: "Winter",
        urgency_score: 7,
        path_tags: ["Visual Arts & Design"]
    },
    {
        id: "11-winter-architecture-studio-visit",
        title: "Visit an architecture firm or studio",
        description: "Shadow an architect, ask questions, and learn about the profession.",
        grade_level: 11,
        season: "Winter",
        urgency_score: 6,
        path_tags: ["Architecture"]
    },
    {
        id: "11-winter-robotics-competition",
        title: "Compete in robotics competition season",
        description: "FRC kickoff is in January. Lead your team through build season.",
        grade_level: 11,
        season: "Winter",
        urgency_score: 8,
        path_tags: ["Engineering (Mech/Civil/Elec)"]
    },
    {
        id: "11-winter-econ-essay-competition",
        title: "Write and submit an economics essay for competition",
        description: "John Locke Institute, Marshall Society Essay, or similar.",
        grade_level: 11,
        season: "Winter",
        urgency_score: 6,
        path_tags: ["Economics & Finance"]
    },
    // --- Spring (Feb-Mar) ---
    {
        id: "11-spring-identify-recommenders",
        title: "Identify recommenders",
        description: "Identify 2 teachers for Letters of Rec. Build relationships.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 9,
        path_tags: []
    },
    {
        id: "11-spring-sat-act-official",
        title: "Take the SAT or ACT",
        description: "Official sitting.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "11-spring-research-scholarships",
        title: "Research scholarships",
        description: "Start a list of deadlines.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 7,
        path_tags: []
    },
    {
        id: "11-spring-research-paper-publish",
        title: "Write or co-author a research paper",
        description: "Aim to submit to a high school research journal or present at a symposium.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 7,
        path_tags: ["Medicine & Health Sciences", "Psychology & Social Sciences", "Engineering (Mech/Civil/Elec)"]
    },
    {
        id: "11-spring-cs-competition-season",
        title: "Compete in spring CS competitions",
        description: "Google Code Jam, ACSL, or math/CS olympiads.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 7,
        path_tags: ["Computer Science"]
    },
    {
        id: "11-spring-portfolio-critique",
        title: "Get professional portfolio critique",
        description: "Attend National Portfolio Day or schedule reviews with college art faculty.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 8,
        path_tags: ["Visual Arts & Design", "Architecture"]
    },
    // --- Spring (Apr-May) ---
    {
        id: "11-spring-campus-visits",
        title: "Plan spring visits",
        description: "See campuses in session.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 8,
        path_tags: []
    },
    {
        id: "11-spring-essay-brainstorm",
        title: "Brainstorm Essay Topics",
        description: "Find your unique story for the Common App.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 6,
        path_tags: []
    },
    {
        id: "11-spring-ap-exams",
        title: "Take AP Exams",
        description: "Essential for college credit.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "11-spring-request-recs",
        title: "Request Letters of Rec",
        description: "Ask formally before summer break to beat the fall rush.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "11-spring-hospital-volunteering",
        title: "Hospital Volunteering",
        description: "Secure a summer position for clinical hours.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 9,
        path_tags: ["Medicine & Health Sciences"]
    },
    {
        id: "11-spring-apply-summer-law-program",
        title: "Apply to a pre-law or government summer program",
        description: "Congressional page program, law school summer institutes, or internships.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 8,
        path_tags: ["Law & Political Science"]
    },
    {
        id: "11-spring-apply-business-internship",
        title: "Secure a business or finance internship for summer",
        description: "Local companies, startups, or financial firms.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 7,
        path_tags: ["Business Administration", "Economics & Finance"]
    },
    {
        id: "11-spring-engineering-internship",
        title: "Apply for an engineering internship or research program",
        description: "RSI, SSTP, or university research programs for rising seniors.",
        grade_level: 11,
        season: "Spring",
        urgency_score: 8,
        path_tags: ["Engineering (Mech/Civil/Elec)"]
    },
    // --- Summer ---
    {
        id: "11-summer-common-app-essay",
        title: "Draft Common App Essay",
        description: "Write multiple drafts of your personal statement.",
        grade_level: 11,
        season: "Summer",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "11-summer-finalize-college-list",
        title: "Finalize college list",
        description: "Know exactly where you apply (Safety, Target, Reach).",
        grade_level: 11,
        season: "Summer",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "11-summer-common-app-account",
        title: "Create Common App account",
        description: "Opens Aug 1. Fill out the basics.",
        grade_level: 11,
        season: "Summer",
        urgency_score: 9,
        path_tags: []
    },
    {
        id: "11-summer-visit-top-choices",
        title: "Visit top-choice colleges",
        description: "Demonstrated interest.",
        grade_level: 11,
        season: "Summer",
        urgency_score: 8,
        path_tags: []
    },
    {
        id: "11-summer-law-internship",
        title: "Intern at a law firm or government office",
        description: "Hands-on experience with legal work, policy, or public service.",
        grade_level: 11,
        season: "Summer",
        urgency_score: 8,
        path_tags: ["Law & Political Science"]
    },
    {
        id: "11-summer-write-creative-portfolio",
        title: "Complete a creative writing portfolio",
        description: "Compile your best short stories, poems, or essays for supplemental applications.",
        grade_level: 11,
        season: "Summer",
        urgency_score: 8,
        path_tags: ["Literature & Creative Writing"]
    },
    {
        id: "11-summer-cs-capstone-project",
        title: "Build a capstone CS project",
        description: "A polished, deployed project that demonstrates your skills. Document everything.",
        grade_level: 11,
        season: "Summer",
        urgency_score: 9,
        path_tags: ["Computer Science"]
    },
    {
        id: "11-summer-engineering-research",
        title: "Conduct engineering research or build a major project",
        description: "A competition-worthy project for Regeneron STS, ISEF, or similar.",
        grade_level: 11,
        season: "Summer",
        urgency_score: 8,
        path_tags: ["Engineering (Mech/Civil/Elec)"]
    },
    {
        id: "11-summer-business-competition",
        title: "Enter a national business plan competition",
        description: "Diamond Challenge, NFTE, or similar entrepreneurship competitions.",
        grade_level: 11,
        season: "Summer",
        urgency_score: 7,
        path_tags: ["Business Administration"]
    },
    {
        id: "11-summer-econ-research-paper",
        title: "Write an economics research paper",
        description: "Original analysis on a topic you care about. Consider submitting to competitions.",
        grade_level: 11,
        season: "Summer",
        urgency_score: 7,
        path_tags: ["Economics & Finance"]
    },
    {
        id: "11-summer-clinical-research",
        title: "Participate in clinical or lab research",
        description: "University research programs, hospital research, or independent study.",
        grade_level: 11,
        season: "Summer",
        urgency_score: 9,
        path_tags: ["Medicine & Health Sciences"]
    },
    {
        id: "11-summer-psych-research-project",
        title: "Complete a psychology or social science research project",
        description: "Design a study, collect data, and write up findings.",
        grade_level: 11,
        season: "Summer",
        urgency_score: 7,
        path_tags: ["Psychology & Social Sciences"]
    },
    {
        id: "11-summer-finalize-art-portfolio",
        title: "Finalize art portfolio for college applications",
        description: "Photograph work professionally. Aim for 15-20 strong, cohesive pieces.",
        grade_level: 11,
        season: "Summer",
        urgency_score: 9,
        path_tags: ["Visual Arts & Design"]
    },
    {
        id: "11-summer-architecture-portfolio-refine",
        title: "Refine architecture portfolio and design projects",
        description: "Include sketches, CAD work, models, and design thinking documentation.",
        grade_level: 11,
        season: "Summer",
        urgency_score: 8,
        path_tags: ["Architecture"]
    },

    // ==================== 12th Grade ====================
    // --- Fall (Aug-Sep) ---
    {
        id: "12-fall-finalize-personal-statement",
        title: "Finalize Personal Statement",
        description: "Polished and proofread.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "12-fall-request-transcripts",
        title: "Request transcripts",
        description: "Follow school procedures to send to colleges.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "12-fall-check-recommenders",
        title: "Check in with recommenders",
        description: "Provide them with your resume/brag sheet.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 9,
        path_tags: []
    },
    {
        id: "12-fall-retake-sat-act",
        title: "Retake SAT/ACT",
        description: "Last chance for early apps.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 9,
        path_tags: []
    },
    // Path-specific: 12th Fall
    {
        id: "12-fall-submit-art-portfolio",
        title: "Submit art portfolio via SlideRoom or school portal",
        description: "Many art schools and programs have early portfolio deadlines.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 10,
        path_tags: ["Visual Arts & Design"]
    },
    {
        id: "12-fall-submit-architecture-portfolio",
        title: "Submit architecture portfolio with applications",
        description: "Ensure portfolio meets each school's specific requirements and format.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 10,
        path_tags: ["Architecture"]
    },
    {
        id: "12-fall-polish-cs-portfolio",
        title: "Polish GitHub and project portfolio for applications",
        description: "Clean up READMEs, document projects, and ensure demos are working.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 8,
        path_tags: ["Computer Science"]
    },
    {
        id: "12-fall-writing-supplement-prep",
        title: "Prepare creative writing supplement for applications",
        description: "Some programs require a portfolio of creative work. Polish your best pieces.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 8,
        path_tags: ["Literature & Creative Writing"]
    },
    {
        id: "12-fall-tailor-why-essays",
        title: "Tailor 'Why This Major' essays to your career path",
        description: "Connect your extracurriculars, research, and goals to your intended field.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 9,
        path_tags: ["Law & Political Science", "Business Administration", "Economics & Finance", "Engineering (Mech/Civil/Elec)", "Medicine & Health Sciences", "Psychology & Social Sciences"]
    },
    // --- Fall (Oct-Nov) ---
    {
        id: "12-fall-submit-ea-ed",
        title: "Submit Early Action/Decision",
        description: "Deadlines are usually Nov 1 or 15. Hit the button!",
        grade_level: 12,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "12-fall-fafsa-css",
        title: "Complete FAFSA/CSS Profile",
        description: "Financial aid is critical. Opens Oct 1.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "12-fall-polish-rd-apps",
        title: "Polish Regular Decision apps",
        description: "In case EA/ED doesn't work out.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 8,
        path_tags: []
    },
    {
        id: "12-fall-submit-regeneron-sts",
        title: "Submit Regeneron STS application",
        description: "Deadline is usually mid-November. Requires a completed research paper.",
        grade_level: 12,
        season: "Fall",
        urgency_score: 9,
        path_tags: ["Engineering (Mech/Civil/Elec)", "Medicine & Health Sciences", "Computer Science", "Psychology & Social Sciences"]
    },
    // --- Winter (Dec-Jan) ---
    {
        id: "12-winter-submit-rd",
        title: "Submit Regular Decision apps",
        description: "Finish line for apps. Usually Jan 1 or 15.",
        grade_level: 12,
        season: "Winter",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "12-winter-confirm-materials",
        title: "Confirm materials received",
        description: "Check college portals to ensure nothing is missing.",
        grade_level: 12,
        season: "Winter",
        urgency_score: 9,
        path_tags: []
    },
    {
        id: "12-winter-avoid-senioritis",
        title: "Avoid 'Senioritis'",
        description: "Colleges care about mid-year reports.",
        grade_level: 12,
        season: "Winter",
        urgency_score: 8,
        path_tags: []
    },
    {
        id: "12-winter-continue-research",
        title: "Continue research or passion project",
        description: "Maintain momentum on your work even after apps are submitted.",
        grade_level: 12,
        season: "Winter",
        urgency_score: 6,
        path_tags: ["Medicine & Health Sciences", "Psychology & Social Sciences", "Computer Science", "Engineering (Mech/Civil/Elec)"]
    },
    {
        id: "12-winter-prepare-art-interviews",
        title: "Prepare for art school portfolio interviews",
        description: "Some programs conduct portfolio reviews or interviews in winter.",
        grade_level: 12,
        season: "Winter",
        urgency_score: 8,
        path_tags: ["Visual Arts & Design", "Architecture"]
    },
    // --- Spring (Feb-Mar) ---
    {
        id: "12-spring-monitor-decisions",
        title: "Monitor email for decisions",
        description: "Celebrate acceptances!",
        grade_level: 12,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "12-spring-local-scholarships",
        title: "Apply for local scholarships",
        description: "Every bit helps.",
        grade_level: 12,
        season: "Spring",
        urgency_score: 7,
        path_tags: []
    },
    {
        id: "12-spring-housing-options",
        title: "Consider housing options",
        description: "Look ahead to dorm deposits.",
        grade_level: 12,
        season: "Spring",
        urgency_score: 6,
        path_tags: []
    },
    {
        id: "12-spring-path-specific-scholarships",
        title: "Apply for major-specific scholarships",
        description: "Many fields have dedicated scholarships (engineering societies, bar associations, art foundations, etc.).",
        grade_level: 12,
        season: "Spring",
        urgency_score: 7,
        path_tags: ["Law & Political Science", "Literature & Creative Writing", "Business Administration", "Economics & Finance", "Computer Science", "Engineering (Mech/Civil/Elec)", "Medicine & Health Sciences", "Psychology & Social Sciences", "Visual Arts & Design", "Architecture"]
    },
    // --- Spring (Apr-May) ---
    {
        id: "12-spring-compare-financial-aid",
        title: "Compare financial aid offers",
        description: "Calculate net cost.",
        grade_level: 12,
        season: "Spring",
        urgency_score: 9,
        path_tags: []
    },
    {
        id: "12-spring-admitted-student-days",
        title: "Attend admitted student days",
        description: "Get the vibe of the campus.",
        grade_level: 12,
        season: "Spring",
        urgency_score: 8,
        path_tags: []
    },
    {
        id: "12-spring-enrollment-deposit",
        title: "Submit enrollment deposit",
        description: "May 1 is National Decision Day. Make your choice!",
        grade_level: 12,
        season: "Spring",
        urgency_score: 10,
        path_tags: []
    },
    {
        id: "12-spring-ap-exams",
        title: "Take AP Exams",
        description: "Finish strong for college credit.",
        grade_level: 12,
        season: "Spring",
        urgency_score: 9,
        path_tags: []
    },
    {
        id: "12-spring-connect-future-classmates",
        title: "Connect with future classmates in your major",
        description: "Join admitted student groups, Discord servers, or social media for your program.",
        grade_level: 12,
        season: "Spring",
        urgency_score: 5,
        path_tags: []
    },
    {
        id: "12-spring-pre-college-reading-list",
        title: "Start a pre-college reading list for your field",
        description: "Get a head start on foundational texts for your intended major.",
        grade_level: 12,
        season: "Spring",
        urgency_score: 4,
        path_tags: ["Law & Political Science", "Literature & Creative Writing", "Economics & Finance", "Psychology & Social Sciences"]
    },
    {
        id: "12-spring-setup-dev-environment",
        title: "Set up your development environment for college",
        description: "Install tools, learn your school's tech stack, and practice with new languages.",
        grade_level: 12,
        season: "Spring",
        urgency_score: 4,
        path_tags: ["Computer Science", "Engineering (Mech/Civil/Elec)"]
    },
    {
        id: "12-spring-prepare-art-supplies",
        title: "Prepare supplies and materials for college art/design program",
        description: "Check required materials lists and invest in quality tools.",
        grade_level: 12,
        season: "Spring",
        urgency_score: 4,
        path_tags: ["Visual Arts & Design", "Architecture"]
    }
];
