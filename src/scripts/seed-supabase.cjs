const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not found. Using Anon Key. Writes may fail if RLS is enabled.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- PORTFOLIO DATA (Copied from src/data/portfolioData.ts) ---
const portfolioData = {
    name: "Sudhakar Reddy Katam",
    title: "Aspiring Software Engineer | Building with AI & Web",
    bio: `I am a Computer Science graduate passionate about building web and mobile applications, both for users and personal projects  you can find some of them in my projects and if you like msg me it will motivate me building more projects. A quick learner, I focus on writing clean, maintainable code and crafting user experiences that make an impact. I constantly explore modern technologies and AI integration to deliver smart, efficient solutions..`,
    skills: [
        { name: "React", category: "Frontend", icon: "Code2" },
        { name: "JavaScript &  typescript", category: "Frontend", icon: "FileCode" },
        { name: "Java", category: "Backend", icon: "Coffee" },
        { name: "HTML5/CSS3", category: "Frontend", icon: "Code2" },
        { name: "Redux", category: "Frontend", icon: "Layers" },
        { name: "Node.js", category: "Backend", icon: "Server" },
        { name: "Python", category: "Backend", icon: "Code" },
        { name: "Spring Boot", category: "Backend", icon: "Coffee" },
        { name: "PostgreSQL", category: "Database", icon: "Database" },
        { name: "MySQL", category: "Database", icon: "Database" },
        { name: "Supabase", category: "Database", icon: "Database" },
        { name: "Firebase", category: "Database", icon: "Flame" },
        { name: "Git & GitHub", category: "Tools", icon: "GitBranch" },
        { name: "Docker", category: "Tools", icon: "Box" },
        { name: "AWS", category: "Tools", icon: "Cloud" },
        { name: "VS Code", category: "Tools", icon: "Code" },
        { name: "AI Tools", category: "Tools", icon: "Bot" },
    ],
    projects: [
        {
            id: "1",
            title: "Personal Tracker Application",
            description: "An android App designed to help users build habits, manage daily tasks, notes and journal, expense tracker, wellness trackers weekly and maintain streaks. Features include habit streak tracking, task management, progress visualization, and only offline app. Users can skip days without losing streaks",
            technologies: ["React", "TypeScript", "Capacitor", "IndexedDB", "Vite", "shadcn ui"],
            github: "https://github.com/sudhakarkatam/tracker22",
            link: "https://github.com/sudhakarkatam/tracker22",
            demo_url: "https://github.com/sudhakarkatam/tracker22",
            features: ["To-do list with sub tasks", "Offline-first app", "Responsive mobile-friendly UI", "Progress visualization charts", "Task and habit management", "Streak and skip tracking system"],
            results: [{ value: "100%", metric: "Offline functionality" }, { value: "Zero", metric: "Data loss on app close" }]
        },
        {
            id: "2",
            title: "Financial Calculators App",
            description: "A multi-calculator Progressive Web App providing various finance-related tools such as SIP, SWP, Compound Interest, and Loan EMI calculators. Built with a mobile-first design for a native-like experience on Android and iOS, integrated via Capacitor and optimized for performance.",
            technologies: ["React", "TypeScript", "Capacitor", "Vite", "Chart.js", "PWA"],
            github: "https://github.com/sudhakarkatam/finance_cal",
            link: "https://play.google.com/store/apps/details?id=com.easecraft.financialcalculator",
            demo_url: "https://play.google.com/store/apps/details?id=com.easecraft.financialcalculator",
            features: ["Multiple financial calculators (SIP, SWP, EMI, etc.)", "Interactive result charts and amortization tables", "Responsive layout for all screen sizes"],
            results: [{ value: "15+", metric: "Financial calculators" }, { value: "100%", metric: "Accuracy in calculations" }]
        },
        {
            id: "3",
            title: "Ecommerce product recommendation",
            description: "An ecommerce platform that allows users to browse and purchase products. It features a product catalog and a blog section. It is divided in categories and subcategories also collections wise to make easier to choose products and also have a admin dashboard to manage the products and the blog section.",
            technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Chart.js", "Supabase", "Vercel"],
            github: "https://www.purevaluepicks.store",
            link: "https://www.purevaluepicks.store",
            demo_url: "https://www.purevaluepicks.store",
            features: ["Curated and categorized product listings", "Admin dashboard for managing collections and content", "Supabase backend for scalable data management", "Responsive, modern UI with Tailwind CSS and Shadcn/UI", "Lazy loading and optimized images for performance", "Deployed with CI/CD on Vercel", "Planned blog and AI-based recommendation engine"],
            results: [{ value: "1000+", metric: "Products curated" }, { value: "99%", metric: "Page load performance" }]
        },
        {
            id: "4",
            title: "Droply - Share Anything, Instantly",
            description: "A temporary file and content sharing platform with end-to-end encryption. Create password-protected rooms to share text, files, code snippets, and URLs with customizable expiry times. No registration required - just instant, secure sharing.",
            technologies: ["React", "TypeScript", "Supabase", "MySQL", "Vite", "shadcn/ui", "Tailwind CSS", "Web Crypto API"],
            github: "https://github.com/sudhakarkatam/droply_app",
            link: "https://droply-app.netlify.app",
            demo_url: "https://droply-app.netlify.app",
            features: ["Temporary rooms with customizable expiry times", "End-to-end encryption with password protection", "Share text, files, code snippets, and URLs", "No registration required", "Separate view/edit access links", "Client-side encryption using AES-GCM"],
            results: [{ value: "100%", metric: "Client-side encryption" }, { value: "Zero", metric: "Server access to shared content" }]
        },
        {
            id: "5",
            title: "JobFinder Hub",
            description: "A comprehensive job board platform with admin dashboard for managing job postings and blogs. Features skill-based job matching, intelligent tag system with related suggestions, and direct application redirects to company websites.",
            technologies: ["React", "TypeScript", "Supabase", "MySQL", "Vercel", "Framer Motion", "Tailwind CSS", "shadcn/ui"],
            github: "https://github.com/sudhakarkatam/Jobfinder-hub",
            link: "https://jobfinder-hub.vercel.app",
            demo_url: "https://jobfinder-hub.vercel.app",
            features: ["Admin dashboard for job and blog management", "Skill-based job matching and filtering", "Smart tag system with related tag suggestions", "Detailed job descriptions with apply now redirects", "Blog section for career advice and insights", "Search functionality with tag filtering"],
            results: [{ value: "1000+", metric: "Job listings" }, { value: "Real-time", metric: "Tag suggestions" }]
        }
    ],
    experience: [
        {
            id: "1",
            role: "B.Tech Computer Science Engineering",
            company: "Malla Reddy University",
            period: "August 2021 - May 2025",
            description: "Completed Bachelor of Technology in Computer Science and Engineering with a specialization in IoT, possessing a strong foundation in software development, and emerging technologies. Actively participated in coding competitions, hackathons, and technical workshops throughout the academic journey.",
            technologies: []
        },
        {
            id: "2",
            role: "Salesforce Developer Virtual Intern",
            company: "SmartBridge (Powered by Salesforce)",
            period: "May 2024 - June 2024",
            description: "Completed intensive 2-month Salesforce development virtual internship focusing on CRM solutions, Apex programming, Lightning Web Components, and Visualforce. Gained hands-on experience in enterprise application development and Salesforce ecosystem.",
            technologies: ["Salesforce", "Apex", "Visualforce", "Lightning Web Components", "SOQL", "SOSL", "CRM", "Process Builder", "Workflow Rules"]
        },
        {
            id: "3",
            role: "AWS Cloud Virtual Internship",
            company: "AICTE (All India Council for Technical Education)",
            period: "May 2023 - July 2023",
            description: "Completed comprehensive 3-month AWS cloud computing virtual internship covering cloud architecture, core services, security, and best practices. Focused on cloud migration strategies, security implementation, and scalable application deployment.",
            technologies: ["AWS", "EC2", "S3", "Lambda", "CloudFormation", "IAM", "CloudWatch"]
        }
    ],
    contact: {
        email: "sudhakarkatam777@gmail.com",
        github: "https://github.com/sudhakarkatam",
        linkedin: "https://www.linkedin.com/in/sudhakar-katam",
        twitter: "https://x.com/sudhakarkatam2",
        resume: "https://drive.google.com/file/d/1qNzycHvflNO2lLynBD3ao9udHO0bJIYJ/view?usp=sharing"
    },
    personalTraits: {
        strengths: ["Quick learner with strong problem-solving abilities", "Excellent communication and teamwork skills", "Detail-oriented with focus on code quality", "Adaptable to new technologies and frameworks", "Strong analytical thinking and debugging skills"],
        weaknesses: ["Sometimes spend too much time perfecting details", "Learning to say no to additional tasks when overloaded", "Working on improving time estimation for projects", "Building confidence in public speaking and presentations"],
        hobbies: ["Coding side projects and exploring new technologies", "Reading tech blogs and staying updated with industry trends", "Playing outdoor games: cricket, volleyball, badminton", "Learning about AI and machine learning concepts", "Contributing to open source projects", "Content creation like Instagram and YouTube"]
    }
};

async function seedData() {
    console.log('🌱 Seeding Supabase data...');

    // 1. Seed Projects
    console.log('Seeding Projects...');
    const { error: projError } = await supabase.from('projects').upsert(portfolioData.projects);
    if (projError) console.error('Error seeding projects:', projError);
    else console.log('✅ Projects seeded');

    // 2. Seed Skills
    console.log('Seeding Skills...');
    // Skills don't have IDs in local data, so we map them. Upsert might duplicate if we run multiple times without IDs.
    // For safety, we'll delete all and re-insert for skills/traits/contact since they are small lists.
    await supabase.from('skills').delete().neq('name', 'placeholder');
    const { error: skillError } = await supabase.from('skills').insert(portfolioData.skills);
    if (skillError) console.error('Error seeding skills:', skillError);
    else console.log('✅ Skills seeded');

    // 3. Seed Experience
    console.log('Seeding Experience...');
    const { error: expError } = await supabase.from('experience').upsert(portfolioData.experience);
    if (expError) console.error('Error seeding experience:', expError);
    else console.log('✅ Experience seeded');

    // 4. Seed Traits
    console.log('Seeding Traits...');
    await supabase.from('personal_traits').delete().neq('value', 'placeholder');
    const traits = [
        ...portfolioData.personalTraits.strengths.map(v => ({ type: 'strength', value: v })),
        ...portfolioData.personalTraits.weaknesses.map(v => ({ type: 'weakness', value: v })),
        ...portfolioData.personalTraits.hobbies.map(v => ({ type: 'hobby', value: v }))
    ];
    const { error: traitError } = await supabase.from('personal_traits').insert(traits);
    if (traitError) console.error('Error seeding traits:', traitError);
    else console.log('✅ Traits seeded');

    // 5. Seed Contact
    console.log('Seeding Contact...');
    await supabase.from('contact_info').delete().neq('value', 'placeholder');
    const contacts = Object.entries(portfolioData.contact).map(([key, value]) => ({ platform: key, value }));
    const { error: contactError } = await supabase.from('contact_info').insert(contacts);
    if (contactError) console.error('Error seeding contact:', contactError);
    else console.log('✅ Contact seeded');

    console.log('✨ Seeding complete!');
}

seedData();
