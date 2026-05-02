import { I_Education, I_Experience } from "@/types/project";

export const experienceData: I_Experience[] = [
  {
    company_link: "https://www.clickskills.in/",
    company_logo: "/clickskills.png",
    company_name: "Clickskills EdTech Pvt. Ltd. · Pune",
    duration: "Jan 2026 – Present",
    job_title: "Software Developer Intern",
    description:
      "Full-stack developer contributing to production features across frontend and backend using modern tech stack. Migrated NoSQL database to PostgreSQL, optimizing query performance and data consistency. Developed responsive UI components using React and Next.js with SSR, reducing initial page load time by 40%. Managed version control using Git/GitHub with clean commit practices.",
  },
];

export const educationData: I_Education[] = [
  {
    institute_link: "https://www.sandipuniversity.edu.in/",
    institute_logo: "/sandips.png",
    course_title: "Master of Computer Applications",
    ending_date: "Expected July 2026",
    institute_name: "Sandip Institute of Technology and Research Centre",
    cgpa: 7.28,
    description: "",
  },
  {
    institute_link: "https://mgvpcmcs.kbhgroup.in/",
    institute_logo: "/panchavati.png",
    course_title: "Bachelor of Computer Science",
    ending_date: "2021-2024",
    institute_name: "Panchavati College of Management & Computer Science",
    cgpa: 8.5,
    description: "",
  }
];
