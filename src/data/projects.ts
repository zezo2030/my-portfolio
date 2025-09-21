import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "ecommerce-app",
    title: "E-Commerce Mobile App",
    description: "A full-featured e-commerce mobile application built with Flutter and Firebase",
    longDescription: "A comprehensive e-commerce solution featuring user authentication, product catalog, shopping cart, payment integration, and order management. Built with Flutter for cross-platform compatibility and Firebase for backend services.",
    technologies: ["Flutter", "Dart", "Firebase", "Stripe API", "Provider"],
    category: "mobile",
    image: "/projects/ecommerce-app.jpg",
    images: [
      "/projects/ecommerce-app-1.jpg",
      "/projects/ecommerce-app-2.jpg",
      "/projects/ecommerce-app-3.jpg"
    ],
    liveUrl: "https://play.google.com/store/apps/details?id=com.example.ecommerce",
    githubUrl: "https://github.com/johndoe/ecommerce-flutter-app",
    featured: true,
    completedAt: new Date("2024-03-15")
  },
  {
    id: "portfolio-website",
    title: "Personal Portfolio Website",
    description: "A modern, responsive portfolio website built with Next.js and Tailwind CSS",
    longDescription: "This very website! A showcase of modern web development practices using Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. Features dark/light mode, smooth animations, and responsive design.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    category: "web",
    image: "/projects/portfolio-website.jpg",
    liveUrl: "https://johndoe-portfolio.vercel.app",
    githubUrl: "https://github.com/johndoe/portfolio-nextjs",
    featured: true,
    completedAt: new Date("2024-02-20")
  },
  {
    id: "task-management-app",
    title: "Task Management Dashboard",
    description: "A collaborative task management application with real-time updates",
    longDescription: "A comprehensive task management solution with team collaboration features, real-time updates, drag-and-drop functionality, and detailed analytics. Built with React and Firebase for seamless user experience.",
    technologies: ["React", "TypeScript", "Firebase", "Material-UI", "React DnD"],
    category: "web",
    image: "/projects/task-management.jpg",
    liveUrl: "https://taskmaster-app.netlify.app",
    githubUrl: "https://github.com/johndoe/task-management-react",
    featured: true,
    completedAt: new Date("2024-01-10")
  },
  {
    id: "weather-app",
    title: "Weather Forecast App",
    description: "A beautiful weather application with location-based forecasts",
    longDescription: "A sleek weather application providing current conditions and 7-day forecasts. Features location detection, beautiful weather animations, and detailed weather metrics. Built with Flutter for iOS and Android.",
    technologies: ["Flutter", "Dart", "OpenWeather API", "Geolocator"],
    category: "mobile",
    image: "/projects/weather-app.jpg",
    githubUrl: "https://github.com/johndoe/weather-flutter-app",
    featured: false,
    completedAt: new Date("2023-11-25")
  },
  {
    id: "blog-platform",
    title: "Blog Platform",
    description: "A full-stack blog platform with CMS capabilities",
    longDescription: "A complete blogging platform with content management system, user authentication, comment system, and SEO optimization. Features rich text editing, image uploads, and social sharing.",
    technologies: ["Next.js", "Node.js", "MongoDB", "NextAuth.js", "Cloudinary"],
    category: "fullstack",
    image: "/projects/blog-platform.jpg",
    liveUrl: "https://myblog-platform.vercel.app",
    githubUrl: "https://github.com/johndoe/blog-platform-nextjs",
    featured: false,
    completedAt: new Date("2023-09-15")
  },
  {
    id: "fitness-tracker",
    title: "Fitness Tracker Mobile App",
    description: "A comprehensive fitness tracking app with workout plans and progress monitoring",
    longDescription: "A complete fitness solution featuring workout tracking, exercise library, progress analytics, and social features. Includes custom workout builder, nutrition tracking, and achievement system.",
    technologies: ["Flutter", "Dart", "SQLite", "Charts", "Camera"],
    category: "mobile",
    image: "/projects/fitness-tracker.jpg",
    githubUrl: "https://github.com/johndoe/fitness-tracker-flutter",
    featured: false,
    completedAt: new Date("2023-07-30")
  }
];

export const projectCategories = {
  web: "Web Development",
  mobile: "Mobile Apps",
  fullstack: "Full-Stack Projects"
} as const;