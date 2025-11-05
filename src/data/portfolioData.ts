import { PortfolioData, ProjectDetail } from "@/types/portfolio";

export const portfolioData: PortfolioData = {
  name: "Sudhakar Reddy Katam",
  title: "Aspiring Software Engineer | Building with AI & Web",
  bio: `I am a Computer Science graduate passionate about building web and mobile applications, both for users and personal projects  you can find some of them in my projects and if you like msg me it will motivate me building more projects. A quick learner, I focus on writing clean, maintainable code and crafting user experiences that make an impact. I constantly explore modern technologies and AI integration to deliver smart, efficient solutions..`,

  skills: [
    { name: "React", category: "Frontend", icon: "Code2" },
    {
      name: "JavaScript &  typescript",
      category: "Frontend",
      icon: "FileCode",
    },
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
      description:
        "An android App designed to help users build habits, manage daily tasks, notes and journal, expense tracker, wellness trackers weekly and maintain streaks. Features include habit streak tracking, task management, progress visualization, and only offline app. Users can skip days without losing streaks",
      technologies: [
        "React",
        "TypeScript",
        "Capacitor",
        "IndexedDB",
        "Vite",
        "shadcn ui",
      ],
      github: "https://github.com/sudhakarkatam/tracker22",
      link: "https://github.com/sudhakarkatam/tracker22",
      status: "Live",
      category: "Productivity",
      icon: "Target",
      demoUrl: "https://github.com/sudhakarkatam/tracker22",
      caseStudyUrl: "",
      duration: "2 weeks",
      teamSize: "Solo Project",
      role: "Personal Project",
      features: [
        "To-do list with sub tasks",
        "Offline-first app",
        "Responsive mobile-friendly UI",
        "Progress visualization charts",
        "Task and habit management",
        "Streak and skip tracking system",
      ],
      challenges: [
        {
          title: "Building reliable offline functionality",
          solution:
            "Implemented sophisticated sync strategies with IndexedDB for offline data storage",
        },
      ],
      results: [
        { value: "100%", metric: "Offline functionality" },
        { value: "Zero", metric: "Data loss on app close" },
      ],
      achievements: [
        "First offline habit tracker with streak preservation",
        "Intuitive task management system",
      ],
      images: ["/personal-tracker.jpeg", "/personal-tracker-1.jpeg"],
      image: "/personal-tracker.jpeg",
      learnings: [
        "Offline-first application development",
        "Mobile app performance optimization",
        "User habit formation psychology",
      ],
    },
    {
      id: "2",
      title: "Financial Calculators App",
      description:
        "A multi-calculator Progressive Web App providing various finance-related tools such as SIP, SWP, Compound Interest, and Loan EMI calculators. Built with a mobile-first design for a native-like experience on Android and iOS, integrated via Capacitor and optimized for performance.",
      technologies: [
        "React",
        "TypeScript",
        "Capacitor",
        "Vite",
        "Chart.js",
        "PWA",
      ],
      github: "https://github.com/sudhakarkatam/finance_cal",
      link: "https://github.com/sudhakarkatam/finance_cal",
      status: "Live",
      category: "FinTech",
      icon: "Calculator",
      demoUrl: "https://github.com/sudhakarkatam/finance_cal",
      caseStudyUrl: "",
      duration: "2 weeks",
      teamSize: "Solo Project",
      role: "Personal Project",
      features: [
        "Multiple financial calculators (SIP, SWP, EMI, etc.)",
        "Interactive result charts and amortization tables",
        "Responsive layout for all screen sizes",
      ],
      challenges: [
        {
          title: "Creating accurate financial calculation algorithms",
          solution:
            "Implemented precise mathematical formulas and validation checks",
        },
      ],
      results: [
        { value: "15+", metric: "Financial calculators" },
        { value: "100%", metric: "Accuracy in calculations" },
      ],
      achievements: [
        "Comprehensive financial calculation toolkit",
        "Native-like mobile experience",
      ],
      images: ["/financial-calculator.jpeg", "/financial-calculator-1.jpeg"],
      image: "/financial-calculator.jpeg",
      learnings: [
        "Financial calculation algorithms",
        "Progressive Web App optimization",
        "Mobile-first responsive design",
      ],
    },
    {
      id: "3",
      title: "Ecommerce product recommendation",
      description:
        "An ecommerce platform that allows users to browse and purchase products. It features a product catalog and a blog section. It is divided in categories and subcategories also collections wise to make easier to choose products and also have a admin dashboard to manage the products and the blog section.",
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Chart.js",
        "Supabase",
        "Vercel",
      ],
      github: "https://www.purevaluepicks.store",
      link: "https://www.purevaluepicks.store",
      status: "Live",
      category: "E-Commerce",
      icon: "ShoppingCart",
      demoUrl: "https://www.purevaluepicks.store",
      caseStudyUrl: "",
      duration: "3 months",
      teamSize: "Solo Project",
      role: "Full Stack Developer",
      features: [
        "Curated and categorized product listings",
        "Admin dashboard for managing collections and content",
        "Supabase backend for scalable data management",
        "Responsive, modern UI with Tailwind CSS and Shadcn/UI",
        "Lazy loading and optimized images for performance",
        "Deployed with CI/CD on Vercel",
        "Planned blog and AI-based recommendation engine",
      ],
      challenges: [
        {
          title: "Building scalable product catalog system",
          solution:
            "Implemented efficient database design with Supabase for fast querying",
        },
      ],
      results: [
        { value: "1000+", metric: "Products curated" },
        { value: "99%", metric: "Page load performance" },
      ],
      achievements: [
        "Comprehensive product discovery platform",
        "Scalable architecture for growth",
      ],
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      learnings: [
        "E-commerce platform architecture",
        "Database optimization for product catalogs",
        "Performance optimization techniques",
      ],
    },
    {
      id: "4",
      title: "Droply - Share Anything, Instantly",
      description:
        "A temporary file and content sharing platform with end-to-end encryption. Create password-protected rooms to share text, files, code snippets, and URLs with customizable expiry times. No registration required - just instant, secure sharing.",
      technologies: [
        "React",
        "TypeScript",
        "Supabase",
        "MySQL",
        "Vite",
        "shadcn/ui",
        "Tailwind CSS",
        "Web Crypto API",
      ],
      github: "https://github.com/sudhakarkatam/droply_app",
      link: "https://droply-app.netlify.app",
      status: "Live",
      category: "Productivity",
      icon: "Share2",
      demoUrl: "https://droply-app.netlify.app",
      caseStudyUrl: "",
      duration: "1 week",
      teamSize: "Solo Project",
      role: "Personal Project",
      features: [
        "Temporary rooms with customizable expiry times",
        "End-to-end encryption with password protection",
        "Share text, files, code snippets, and URLs",
        "No registration required",
        "Separate view/edit access links",
        "Client-side encryption using AES-GCM",
      ],
      challenges: [
        {
          title: "Implementing secure client-side encryption",
          solution:
            "Used Web Crypto API with AES-GCM and PBKDF2 for key derivation, ensuring data security without server-side decryption",
        },
      ],
      results: [
        { value: "100%", metric: "Client-side encryption" },
        { value: "Zero", metric: "Server access to shared content" },
      ],
      achievements: [
        "Secure temporary file sharing platform",
        "Privacy-first design with automatic expiry",
      ],
      images: ["/placeholder.svg", "/placeholder.svg"],
      image: "/placeholder.svg",
      learnings: [
        "Web Crypto API implementation",
        "Client-side encryption strategies",
        "Secure file sharing architecture",
      ],
    },
    {
      id: "5",
      title: "JobFinder Hub",
      description:
        "A comprehensive job board platform with admin dashboard for managing job postings and blogs. Features skill-based job matching, intelligent tag system with related suggestions, and direct application redirects to company websites.",
      technologies: [
        "React",
        "TypeScript",
        "Supabase",
        "MySQL",
        "Vercel",
        "Framer Motion",
        "Tailwind CSS",
        "shadcn/ui",
      ],
      github: "https://github.com/sudhakarkatam/Jobfinder-hub",
      link: "https://jobfinder-hub.vercel.app",
      status: "Live",
      category: "Job Portal",
      icon: "Briefcase",
      demoUrl: "https://jobfinder-hub.vercel.app",
      caseStudyUrl: "",
      duration: "2 weeks",
      teamSize: "Solo Project",
      role: "Full Stack Developer",
      features: [
        "Admin dashboard for job and blog management",
        "Skill-based job matching and filtering",
        "Smart tag system with related tag suggestions",
        "Detailed job descriptions with apply now redirects",
        "Blog section for career advice and insights",
        "Search functionality with tag filtering",
      ],
      challenges: [
        {
          title: "Building intelligent tag matching system",
          solution:
            "Implemented tag relationships and suggestions using Supabase queries with full-text search capabilities",
        },
      ],
      results: [
        { value: "1000+", metric: "Job listings" },
        { value: "Real-time", metric: "Tag suggestions" },
      ],
      achievements: [
        "Comprehensive job discovery platform",
        "Intelligent search and matching system",
      ],
      images: ["/placeholder.svg", "/placeholder.svg"],
      image: "/placeholder.svg",
      learnings: [
        "Tag-based search implementation",
        "Admin dashboard design patterns",
        "Real-time data filtering and search functionality",
      ],
    },
  ],

  experience: [
    {
      id: "1",
      role: "B.Tech Computer Science Engineering",
      company: "Malla Reddy University",
      period: "August 2021 - May 2025",
      description:
        "Completed Bachelor of Technology in Computer Science and Engineering with a specialization in IoT, possessing a strong foundation in software development, and emerging technologies. Actively participated in coding competitions, hackathons, and technical workshops throughout the academic journey.",
      achievements: [
        "Maintained 8.58 CGPA throughout the 4-year B.Tech program",
      ],
      current: false,
      position: "Computer Science Engineering Student",
      duration: "",
      location: "Hyderabad, Telangana, India",
      type: "Education",
      certificateUrl: "",
    },
    {
      id: "2",
      role: "Salesforce Developer Virtual Intern",
      company: "SmartBridge (Powered by Salesforce)",
      period: "May 2024 - June 2024",
      description:
        "Completed intensive 2-month Salesforce development virtual internship focusing on CRM solutions, Apex programming, Lightning Web Components, and Visualforce. Gained hands-on experience in enterprise application development and Salesforce ecosystem.",
      achievements: [
        "Successfully completed Salesforce Developer internship program with excellence",
      ],
      current: false,
      position: "Salesforce Developer Intern",
      duration: "2 months",
      location: "Hyderabad, Telangana, India (Virtual)",
      type: "Virtual Internship",
      technologies: [
        "Salesforce",
        "Apex",
        "Visualforce",
        "Lightning Web Components",
        "SOQL",
        "SOSL",
        "CRM",
        "Process Builder",
        "Workflow Rules",
      ],
      certificateUrl:
        "https://drive.google.com/file/d/1j2jyRZ1Q9HTowxMYL2YXSIgeg6gv_HEu/view?usp=sharing",
    },
    {
      id: "3",
      role: "AWS Cloud Virtual Internship",
      company: "AICTE (All India Council for Technical Education)",
      period: "May 2023 - July 2023",
      description:
        "Completed comprehensive 3-month AWS cloud computing virtual internship covering cloud architecture, core services, security, and best practices. Focused on cloud migration strategies, security implementation, and scalable application deployment.",
      achievements: [
        "Successfully completed AWS Virtual Internship program with distinction",
        "Gained expertise in AWS core services and cloud architecture patterns",
        "Learned cloud security, compliance, and governance best practices",
      ],
      current: false,
      position: "AWS Cloud Virtual Intern",
      duration: "3 months",
      location: "Remote (Online Virtual Program)",
      type: "Virtual Internship",
      technologies: [
        "AWS",
        "EC2",
        "S3",
        "Lambda",
        "CloudFormation",
        "IAM",
        "CloudWatch",
      ],
      certificateUrl:
        "https://drive.google.com/file/d/1Ty2qzZyTdThHYfETXUPkxZw7cIQcs3TV/view?usp=sharing",
    },
  ],

  contact: {
    email: "sudhakarkatam777@gmail.com",
    github: "https://github.com/sudhakarkatam",
    linkedin: "https://www.linkedin.com/in/sudhakar-katam",
    twitter: "https://x.com/sudhakarkatam2",
    resume:
      "https://drive.google.com/file/d/1qNzycHvflNO2lLynBD3ao9udHO0bJIYJ/view?usp=sharing", // Add your resume link here (Google Drive, PDF link, etc.)
  },

  availability: {
    available: true,
    statusText: "Open to opportunities",
    lastUpdated: new Date(),
  },

  personalTraits: {
    strengths: [
      "Quick learner with strong problem-solving abilities",
      "Excellent communication and teamwork skills",
      "Detail-oriented with focus on code quality",
      "Adaptable to new technologies and frameworks",
      "Strong analytical thinking and debugging skills",
    ],
    weaknesses: [
      "Sometimes spend too much time perfecting details",
      "Learning to say no to additional tasks when overloaded",
      "Working on improving time estimation for projects",
      "Building confidence in public speaking and presentations",
    ],
    hobbies: [
      "Coding side projects and exploring new technologies",
      "Reading tech blogs and staying updated with industry trends",
      "Playing outdoor games: cricket, volleyball, badminton",
      "Learning about AI and machine learning concepts",
      "Contributing to open source projects",
      "Content creation like Instagram and YouTube",
    ],
  },
};
