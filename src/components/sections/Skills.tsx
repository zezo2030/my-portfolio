"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { skills, skillCategories } from "@/data/skills";
import { useResponsive } from "@/hooks";

export function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const { isMobile, isTablet, isLandscape } = useResponsive();

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

  const filteredSkills = selectedCategory === "all" 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  const categories = [
    { key: "all", label: "All Skills" },
    ...Object.entries(skillCategories).map(([key, label]) => ({ key, label }))
  ];

  const getProficiencyWidth = (proficiency: number) => {
    return `${(proficiency / 5) * 100}%`;
  };

  const getProficiencyLabel = (proficiency: number) => {
    const labels = ["Beginner", "Basic", "Intermediate", "Advanced", "Expert"];
    return labels[proficiency - 1];
  };

  return (
    <section 
      id="skills" 
      className={`${
        isMobile && isLandscape ? 'min-h-screen landscape-compact' : 'min-h-screen'
      } flex items-center justify-center ${
        isMobile && isLandscape ? 'py-8' : 'py-20'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div className="text-center mb-16" variants={itemVariants} transition={itemTransition}>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Skills & Technologies
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Here are the technologies and tools I work with to bring ideas to life
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

          {/* Skills Grid */}
          <motion.div 
            className={`grid ${
              isMobile ? 'grid-cols-1 gap-4' : 
              isTablet ? 'grid-cols-2 gap-5' : 
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            }`}
            layout
          >
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                className="group relative"
                variants={itemVariants}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onHoverStart={() => setHoveredSkill(skill.id)}
                onHoverEnd={() => setHoveredSkill(null)}
              >
                <div className="relative bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-2">
                  {/* Skill Icon and Name */}
                  <div className="text-center mb-4">
                    <motion.div
                      className="text-4xl mb-3 inline-block"
                      animate={{
                        scale: hoveredSkill === skill.id ? 1.2 : 1,
                        rotate: hoveredSkill === skill.id ? [0, -10, 10, 0] : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {skill.icon}
                    </motion.div>
                    <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                      {skill.name}
                    </h3>
                    <p className="text-xs text-muted-foreground capitalize mt-1">
                      {skill.category.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </div>

                  {/* Proficiency Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Proficiency</span>
                      <span className="text-primary font-medium">
                        {getProficiencyLabel(skill.proficiency)}
                      </span>
                    </div>
                    
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: getProficiencyWidth(skill.proficiency) }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    
                    {/* Proficiency dots */}
                    <div className="flex justify-center gap-1 mt-3">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <motion.div
                          key={level}
                          className={`w-2 h-2 rounded-full ${
                            level <= skill.proficiency
                              ? "bg-primary"
                              : "bg-muted"
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + level * 0.05 }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  />

                  {/* Floating particles on hover */}
                  {hoveredSkill === skill.id && (
                    <>
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-primary rounded-full"
                          initial={{ 
                            x: Math.random() * 200 - 100,
                            y: Math.random() * 200 - 100,
                            opacity: 0 
                          }}
                          animate={{
                            x: Math.random() * 400 - 200,
                            y: Math.random() * 400 - 200,
                            opacity: [0, 1, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Skills Summary */}
          <motion.div 
            className="mt-16 text-center"
            variants={itemVariants}
            transition={itemTransition}
          >
            <div className="bg-background/30 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Always Learning & Growing
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Technology evolves rapidly, and I&apos;m committed to continuous learning. 
                I regularly explore new frameworks, tools, and best practices to stay 
                current with industry trends and deliver cutting-edge solutions.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                {Object.entries(skillCategories).map(([key, label]) => {
                  const categorySkills = skills.filter(skill => skill.category === key);
                  return (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {categorySkills.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {label.split(' ')[0]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}