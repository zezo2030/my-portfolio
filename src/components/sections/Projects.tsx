"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ExternalLink, Github, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projects, projectCategories } from "@/data/projects";
import { Project } from "@/types";

export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  const itemTransition = {
    duration: 0.5,
    ease: [0.25, 0.46, 0.45, 0.94] as const
  };

  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);



  const categories = [
    { key: "all", label: "All Projects" },
    ...Object.entries(projectCategories).map(([key, label]) => ({ key, label }))
  ];

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProject?.images) {
      setCurrentImageIndex((prev) => 
        prev === selectedProject.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProject?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProject.images!.length - 1 : prev - 1
      );
    }
  };

  return (
    <>
      <section id="projects" className="min-h-screen flex items-center justify-center bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Section Header */}
            <motion.div className="text-center mb-16" variants={itemVariants} transition={itemTransition}>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Here are some of my recent projects that showcase my skills and passion for development
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
            </motion.div>

            {/* Category Filter */}
            <motion.div 
              className="flex flex-wrap justify-center gap-3 mb-12"
              variants={itemVariants}
              transition={itemTransition}
            >
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.key
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "bg-background/50 text-muted-foreground hover:bg-background hover:text-foreground border border-border/50"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </motion.div>

            {/* Projects Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              layout
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="group cursor-pointer"
                  variants={itemVariants}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => openProjectModal(project)}
                >
                  <div className="relative bg-background/50 backdrop-blur-sm rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
                    {/* Project Image */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-primary/30">
                        {project.title.charAt(0)}
                      </div>
                      
                      {/* Featured Badge */}
                      {project.featured && (
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                          Featured
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                      
                      {/* Quick Actions */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex gap-2">
                          {project.liveUrl && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(project.liveUrl, '_blank');
                              }}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                          {project.githubUrl && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(project.githubUrl, '_blank');
                              }}
                            >
                              <Github className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <span className="text-xs text-muted-foreground capitalize px-2 py-1 bg-muted rounded-full">
                          {project.category}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-xs text-muted-foreground px-2 py-1">
                            +{project.technologies.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Date */}
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {project.completedAt.toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* View All Projects CTA */}
            <motion.div 
              className="text-center mt-12"
              variants={itemVariants}
              transition={itemTransition}
            >
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setSelectedCategory("all")}
              >
                View All Projects
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProjectModal}
          >
            <motion.div
              className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground">
                  {selectedProject.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeProjectModal}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Image Gallery */}
                {selectedProject.images && selectedProject.images.length > 0 && (
                  <div className="relative mb-6">
                    <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-8xl font-bold text-primary/30">
                        {selectedProject.title.charAt(0)}
                      </div>
                      
                      {selectedProject.images.length > 1 && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2"
                            onClick={prevImage}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={nextImage}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                    
                    {selectedProject.images.length > 1 && (
                      <div className="flex justify-center mt-4 gap-2">
                        {selectedProject.images.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex ? 'bg-primary' : 'bg-muted'
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Project Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">About This Project</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedProject.longDescription || selectedProject.description}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Links */}
                  <div className="flex gap-4 pt-4">
                    {selectedProject.liveUrl && (
                      <Button
                        onClick={() => window.open(selectedProject.liveUrl, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Live Project
                      </Button>
                    )}
                    {selectedProject.githubUrl && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(selectedProject.githubUrl, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <Github className="w-4 h-4" />
                        View Source Code
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}