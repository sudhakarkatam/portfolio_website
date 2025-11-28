const fs = require('fs');
const path = require('path');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log("SCRIPT STARTED - Generating Embeddings...");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY is not set in .env file');
    process.exit(1);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not found. Using Anon Key. Writes may fail if RLS is enabled.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- FALLBACK LOCAL DATA (Copied from src/data/portfolioData.ts) ---
const fallbackPortfolioData = {
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
            features: ["To-do list with sub tasks", "Offline-first app", "Responsive mobile-friendly UI", "Progress visualization charts", "Task and habit management", "Streak and skip tracking system"],
            results: [{ value: "100%", metric: "Offline functionality" }, { value: "Zero", metric: "Data loss on app close" }]
        },
        {
            id: "2",
            title: "Financial Calculators App",
            description: "A multi-calculator Progressive Web App providing various finance-related tools such as SIP, SWP, Compound Interest, and Loan EMI calculators. Built with a mobile-first design for a native-like experience on Android and iOS, integrated via Capacitor and optimized for performance.",
            technologies: ["React", "TypeScript", "Capacitor", "Vite", "Chart.js", "PWA"],
            features: ["Multiple financial calculators (SIP, SWP, EMI, etc.)", "Interactive result charts and amortization tables", "Responsive layout for all screen sizes"],
            results: [{ value: "15+", metric: "Financial calculators" }, { value: "100%", metric: "Accuracy in calculations" }]
        },
        {
            id: "3",
            title: "Ecommerce product recommendation",
            description: "An ecommerce platform that allows users to browse and purchase products. It features a product catalog and a blog section. It is divided in categories and subcategories also collections wise to make easier to choose products and also have a admin dashboard to manage the products and the blog section.",
            technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Chart.js", "Supabase", "Vercel"],
            features: ["Curated and categorized product listings", "Admin dashboard for managing collections and content", "Supabase backend for scalable data management", "Responsive, modern UI with Tailwind CSS and Shadcn/UI", "Lazy loading and optimized images for performance", "Deployed with CI/CD on Vercel", "Planned blog and AI-based recommendation engine"],
            results: [{ value: "1000+", metric: "Products curated" }, { value: "99%", metric: "Page load performance" }]
        },
        {
            id: "4",
            title: "Droply - Share Anything, Instantly",
            description: "A temporary file and content sharing platform with end-to-end encryption. Create password-protected rooms to share text, files, code snippets, and URLs with customizable expiry times. No registration required - just instant, secure sharing.",
            technologies: ["React", "TypeScript", "Supabase", "MySQL", "Vite", "shadcn/ui", "Tailwind CSS", "Web Crypto API"],
            features: ["Temporary rooms with customizable expiry times", "End-to-end encryption with password protection", "Share text, files, code snippets, and URLs", "No registration required", "Separate view/edit access links", "Client-side encryption using AES-GCM"],
            results: [{ value: "100%", metric: "Client-side encryption" }, { value: "Zero", metric: "Server access to shared content" }]
        },
        {
            id: "5",
            title: "JobFinder Hub",
            description: "A comprehensive job board platform with admin dashboard for managing job postings and blogs. Features skill-based job matching, intelligent tag system with related suggestions, and direct application redirects to company websites.",
            technologies: ["React", "TypeScript", "Supabase", "MySQL", "Vercel", "Framer Motion", "Tailwind CSS", "shadcn/ui"],
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
        twitter: "https://x.com/sudhakarkatam2"
    },
    personalTraits: {
        strengths: ["Quick learner with strong problem-solving abilities", "Excellent communication and teamwork skills", "Detail-oriented with focus on code quality", "Adaptable to new technologies and frameworks", "Strong analytical thinking and debugging skills"],
        weaknesses: ["Sometimes spend too much time perfecting details", "Learning to say no to additional tasks when overloaded", "Working on improving time estimation for projects", "Building confidence in public speaking and presentations"],
        hobbies: ["Coding side projects and exploring new technologies", "Reading tech blogs and staying updated with industry trends", "Playing outdoor games: cricket, volleyball, badminton", "Learning about AI and machine learning concepts", "Contributing to open source projects", "Content creation like Instagram and YouTube"]
    }
};

// --- FETCH DATA FROM SUPABASE ---
async function fetchPortfolioData() {
    console.log('Fetching portfolio data from Supabase...');
    try {
        const [projects, skills, experience, traits, contact] = await Promise.all([
            supabase.from('projects').select('*').order('created_at', { ascending: false }),
            supabase.from('skills').select('*'),
            supabase.from('experience').select('*'),
            supabase.from('personal_traits').select('*'),
            supabase.from('contact_info').select('*')
        ]);

        if (projects.error || skills.error || experience.error || traits.error || contact.error) {
            throw new Error('One or more tables failed to fetch');
        }

        // If tables are empty, fallback
        if (!projects.data.length && !skills.data.length) {
            console.warn('⚠️ Supabase tables appear empty. Using local fallback data.');
            return fallbackPortfolioData;
        }

        // Reconstruct Object
        const portfolio = {
            name: fallbackPortfolioData.name, // Name/Title/Bio might be in a 'profile' table later, keeping fallback for now
            title: fallbackPortfolioData.title,
            bio: fallbackPortfolioData.bio,
            projects: projects.data || [],
            skills: skills.data || [],
            experience: experience.data || [],
            personalTraits: {
                strengths: traits.data.filter(t => t.type === 'strength').map(t => t.value),
                weaknesses: traits.data.filter(t => t.type === 'weakness').map(t => t.value),
                hobbies: traits.data.filter(t => t.type === 'hobby').map(t => t.value)
            },
            contact: contact.data.reduce((acc, curr) => ({ ...acc, [curr.platform]: curr.value }), {})
        };

        // Ensure contact has defaults if missing
        if (!portfolio.contact.email) portfolio.contact = fallbackPortfolioData.contact;

        console.log('✅ Successfully fetched portfolio data from Supabase');
        return portfolio;

    } catch (error) {
        console.error('⚠️ Error fetching from Supabase:', error.message);
        console.log('Using local fallback data...');
        return fallbackPortfolioData;
    }
}

// --- FETCH SUPABASE CONTEXT ---
async function fetchSupabaseContext() {
    try {
        const { data, error } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'system_prompt')
            .single();

        if (error) throw error;
        if (data && data.value) {
            console.log('✅ Fetched custom context from Supabase');
            return `\n\n[SUPABASE CONTEXT]\n${data.value}\n`;
        }
    } catch (error) {
        console.warn('⚠️ Failed to fetch Supabase context:', error.message);
    }
    return null;
}

// --- CHUNKING LOGIC ---
const chunkPortfolioData = (data, customContext) => {
    const chunks = [];

    // 1. Bio Chunk
    chunks.push({
        id: 'bio',
        text: `Bio: ${data.bio} Name: ${data.name}. Title: ${data.title}.`,
        metadata: { type: 'bio', title: 'Biography' }
    });

    // 2. Skills Chunk
    const skillsText = data.skills.map(s => `${s.name} (${s.category})`).join(', ');
    chunks.push({
        id: 'skills',
        text: `Skills: ${skillsText}`,
        metadata: { type: 'skill', title: 'Skills' }
    });

    // 3. Projects Chunks
    const allProjectsSummary = data.projects.map(p => `${p.title} (GitHub: ${p.github}, Live: ${p.link || p.demoUrl})`).join('; ');
    chunks.push({
        id: 'projects-summary',
        text: `All Projects List with Links: ${allProjectsSummary}. I have worked on ${data.projects.length} projects in total. Use this list to provide a summary with links when asked about "all projects".`,
        metadata: { type: 'project', title: 'All Projects Summary' }
    });

    data.projects.forEach(project => {
        const projectText = `Project: ${project.title}. Description: ${project.description}. Technologies: ${project.technologies ? project.technologies.join(', ') : ''}. Features: ${project.features ? project.features.join(', ') : ''}. Results: ${project.results ? project.results.map(r => r.metric + ': ' + r.value).join(', ') : ''}. Links: GitHub (${project.github}), Live Demo (${project.link || project.demoUrl}).`;
        chunks.push({
            id: `project-${project.id}`,
            text: projectText,
            metadata: { type: 'project', title: project.title }
        });
    });

    // 4. Experience Chunks
    data.experience.forEach(exp => {
        const expText = `Experience: ${exp.role} at ${exp.company}. Period: ${exp.period}. Description: ${exp.description}. Technologies: ${exp.technologies ? exp.technologies.join(', ') : 'N/A'}.`;
        chunks.push({
            id: `exp-${exp.id}`,
            text: expText,
            metadata: { type: 'experience', title: exp.role }
        });
    });

    // 5. Personal Traits Chunk
    const traitsText = `Strengths: ${data.personalTraits.strengths.join(', ')}. Weaknesses: ${data.personalTraits.weaknesses.join(', ')}. Hobbies: ${data.personalTraits.hobbies.join(', ')}.`;
    chunks.push({
        id: 'traits',
        text: `Personal Traits: ${traitsText}`,
        metadata: { type: 'trait', title: 'Personal Traits' }
    });

    // 6. Contact Chunk
    const contactText = `Email: ${data.contact.email}. GitHub: ${data.contact.github}. LinkedIn: ${data.contact.linkedin}. Twitter: ${data.contact.twitter}. Resume: ${data.contact.resume}.`;
    chunks.push({
        id: 'contact',
        text: `Contact Info: ${contactText}`,
        metadata: { type: 'contact', title: 'Contact Information' }
    });

    // 7. Custom Context Chunks
    if (customContext) {
        const customSections = customContext.split(/\n(?=[A-Z\s&]+:)/g).filter(s => s.trim().length > 0);

        customSections.forEach((section, index) => {
            const titleMatch = section.match(/^([A-Z\s&]+):/);
            const title = titleMatch ? titleMatch[1].trim() : 'Additional Info';

            chunks.push({
                id: `custom-${index}`,
                text: section.trim(),
                metadata: { type: 'custom', title: title }
            });
        });
    }

    return chunks;
};

const logFile = path.resolve(process.cwd(), 'src/scripts/debug.log');
function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
}

// --- API CALL ---
async function generateEmbeddings() {
    log('Starting embedding generation...');

    // 1. Determine Context Source
    let customContext = '';
    const supabaseContext = await fetchSupabaseContext();

    if (supabaseContext) {
        // PRIORITY: Use Supabase Context ONLY if available
        customContext = supabaseContext;
        log('Using Supabase System Prompt.');
    } else {
        // FALLBACK: Use Local File
        log('Supabase System Prompt not found. Using local customContext.ts.');
        const customContextPath = path.resolve(process.cwd(), 'src/data/customContext.ts');
        try {
            const fileContent = fs.readFileSync(customContextPath, 'utf8');
            const match = fileContent.match(/export const customContext = `([\s\S]*?)`;/);
            if (match && match[1]) {
                customContext = match[1];
            }
        } catch (e) {
            console.error('Error reading local customContext.ts:', e.message);
        }
    }

    // 2. Fetch Portfolio Data (Supabase with Local Fallback)
    const portfolioData = await fetchPortfolioData();

    // 3. Chunk Data
    const chunks = chunkPortfolioData(portfolioData, customContext);
    log(`Generated ${chunks.length} chunks from portfolio data.`);

    const embeddedChunks = [];

    for (const chunk of chunks) {
        log(`Generating embedding for chunk: ${chunk.id}`);

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`;
            const body = JSON.stringify({
                model: 'models/text-embedding-004',
                content: {
                    parts: [{ text: chunk.text }]
                }
            });

            const response = await new Promise((resolve, reject) => {
                const req = https.request(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(body)
                    }
                }, (res) => {
                    let data = '';
                    res.on('data', (chunk) => data += chunk);
                    res.on('end', () => resolve({ status: res.statusCode, statusText: res.statusMessage, data: JSON.parse(data) }));
                });

                req.on('error', reject);
                req.write(body);
                req.end();
            });

            if (response.status !== 200) {
                log(`API Error: ${response.status} ${response.statusText} - ${JSON.stringify(response.data)}`);
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const embedding = response.data.embedding.values;

            embeddedChunks.push({
                ...chunk,
                embedding
            });
            log(`Success for chunk: ${chunk.id}`);

        } catch (error) {
            log(`Failed to generate embedding for chunk ${chunk.id}: ${error.message}`);
        }
    }

    // --- UPLOAD TO SUPABASE ---
    log(`Uploading ${embeddedChunks.length} embeddings to Supabase...`);

    // Clear existing documents first
    const { error: deleteError } = await supabase.from('documents').delete().neq('id', 0);
    if (deleteError) {
        console.error('Error clearing old documents (Check RLS policies):', deleteError.message);
    } else {
        log('Cleared old documents from Supabase.');
    }

    // Prepare data for insertion
    const rows = embeddedChunks.map(chunk => ({
        content: chunk.text,
        metadata: chunk.metadata || {},
        embedding: chunk.embedding
    }));

    // Insert in batches
    const BATCH_SIZE = 50;
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('documents').insert(batch);

        if (error) {
            console.error(`Error inserting batch ${i} (Check RLS policies):`, error.message);
        } else {
            log(`Inserted batch ${i} to ${i + batch.length}`);
        }
    }

    log('✅ Successfully updated Supabase embeddings!');
}

generateEmbeddings();
