import { Github, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

export const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/johndoe",
    icon: Github,
    label: "Visit my GitHub profile",
    color: "hover:text-gray-900 dark:hover:text-gray-100"
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/johndoe",
    icon: Linkedin,
    label: "Connect with me on LinkedIn",
    color: "hover:text-blue-600"
  },
  {
    name: "Twitter",
    url: "https://twitter.com/johndoe",
    icon: Twitter,
    label: "Follow me on Twitter",
    color: "hover:text-blue-400"
  },
  {
    name: "Email",
    url: "mailto:john.developer@email.com",
    icon: Mail,
    label: "Send me an email",
    color: "hover:text-green-600"
  }
];

export const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "john.developer@email.com",
    href: "mailto:john.developer@email.com"
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567"
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Remote / Global",
    href: null
  }
];

export const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" }
];

export const professionalLinks = [
  { name: "Resume", href: "/resume.pdf", external: true },
  { name: "Portfolio", href: "#projects" },
  { name: "Blog", href: "/blog", external: true },
  { name: "Services", href: "#contact" }
];