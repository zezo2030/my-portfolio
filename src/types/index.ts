export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  category: 'web' | 'mobile' | 'fullstack';
  image: string;
  images?: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  completedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'mobile' | 'tools' | 'database';
  proficiency: 1 | 2 | 3 | 4 | 5;
  icon: string;
  color: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NavItem {
  name: string;
  href: string;
  label: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}