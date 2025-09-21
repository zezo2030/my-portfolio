import { Skill } from "@/types";

export const skills: Skill[] = [
  // Frontend
  {
    id: "react",
    name: "React",
    category: "frontend",
    proficiency: 5,
    icon: "⚛️",
    color: "#61DAFB"
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "frontend",
    proficiency: 5,
    icon: "▲",
    color: "#000000"
  },
  {
    id: "html",
    name: "HTML",
    category: "frontend",
    proficiency: 5,
    icon: "🌐",
    color: "#E34F26"
  },
  {
    id: "css",
    name: "CSS",
    category: "frontend",
    proficiency: 5,
    icon: "🎨",
    color: "#1572B6"
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "frontend",
    proficiency: 5,
    icon: "🟨",
    color: "#F7DF1E"
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "frontend",
    proficiency: 4,
    icon: "🔷",
    color: "#3178C6"
  },
  
  // Mobile
  {
    id: "flutter",
    name: "Flutter",
    category: "mobile",
    proficiency: 5,
    icon: "🐦",
    color: "#02569B"
  },
  {
    id: "dart",
    name: "Dart",
    category: "mobile",
    proficiency: 5,
    icon: "🎯",
    color: "#0175C2"
  },
  
  // Backend & Database
  {
    id: "firebase",
    name: "Firebase",
    category: "backend",
    proficiency: 4,
    icon: "🔥",
    color: "#FFCA28"
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    proficiency: 4,
    icon: "🟢",
    color: "#339933"
  },
  
  // Tools
  {
    id: "git",
    name: "Git",
    category: "tools",
    proficiency: 5,
    icon: "📚",
    color: "#F05032"
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "tools",
    proficiency: 5,
    icon: "💨",
    color: "#06B6D4"
  }
];

export const skillCategories = {
  frontend: "Frontend Development",
  mobile: "Mobile Development", 
  backend: "Backend & Database",
  tools: "Tools & Technologies"
} as const;