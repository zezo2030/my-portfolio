"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Code, Heart, Coffee, Zap } from "lucide-react";
import { useResponsive, useDeviceCapabilities } from "@/hooks";

export function About() {
  const { isMobile, isTablet, isLandscape } = useResponsive();
  const { hasCoarsePointer } = useDeviceCapabilities();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const itemTransition = {
    duration: 0.6,
    ease: [0.25, 0.46, 0.45, 0.94] as const
  };

  const milestones = [
    {
      year: "2020",
      title: "Started Programming Journey",
      description: "Began learning web development with HTML, CSS, and JavaScript"
    },
    {
      year: "2021",
      title: "Discovered React",
      description: "Fell in love with React and modern frontend development"
    },
    {
      year: "2022",
      title: "Mobile Development",
      description: "Started building mobile apps with Flutter and Dart"
    },
    {
      year: "2023",
      title: "Full-Stack Developer",
      description: "Expanded to backend development and database management"
    },
    {
      year: "2024",
      title: "Professional Growth",
      description: "Building complex applications and leading development projects"
    }
  ];

  const interests = [
    { icon: Code, label: "Clean Code", color: "text-blue-500" },
    { icon: Zap, label: "Performance", color: "text-yellow-500" },
    { icon: Heart, label: "User Experience", color: "text-red-500" },
    { icon: Coffee, label: "Problem Solving", color: "text-amber-600" }
  ];

  return (
    <section 
      id="about" 
      className={`${
        isMobile && isLandscape ? 'min-h-screen landscape-compact' : 'min-h-screen'
      } flex items-center justify-center bg-muted/30 ${
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
          <motion.div 
            className={`text-center ${
              isMobile && isLandscape ? 'mb-8' : 'mb-16'
            }`} 
            variants={itemVariants}
            transition={itemTransition}
          >
            <h2 className={`${
              isMobile ? 'text-3xl' : isTablet ? 'text-4xl' : 'text-4xl md:text-5xl'
            } font-bold text-foreground mb-4`}>
              About Me
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
          </motion.div>

          {/* Main Content Grid */}
          <div className={`grid ${
            isMobile ? 'grid-cols-1 gap-8' : 
            isTablet ? 'grid-cols-1 gap-10' : 
            'lg:grid-cols-2 gap-12 lg:gap-16'
          } items-center`}>
            {/* Left Column - Profile Image and Quick Info */}
            <motion.div 
              className={`${
                isMobile && isLandscape ? 'space-y-4' : 'space-y-8'
              } ${isMobile || isTablet ? 'order-2' : ''}`} 
              variants={itemVariants}
              transition={itemTransition}
            >
              {/* Profile Image */}
              <div className={`relative mx-auto lg:mx-0 ${
                isMobile ? 'w-64 h-64' : isTablet ? 'w-72 h-72' : 'w-80 h-80'
              } max-w-full`}>
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-1">
                  <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center overflow-hidden">
                    <div className={`w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center ${
                      isMobile ? 'text-4xl' : isTablet ? 'text-5xl' : 'text-6xl'
                    } font-bold text-primary`}>
                      JD
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  Available for work
                </motion.div>
              </div>

              {/* Quick Info Cards */}
              <div className={`grid ${
                isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'
              }`}>
                <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Location</span>
                  </div>
                  <p className="font-semibold text-foreground">Remote / Global</p>
                </div>

                <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Experience</span>
                  </div>
                  <p className="font-semibold text-foreground">4+ Years</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column - About Content */}
            <motion.div 
              className={`${
                isMobile && isLandscape ? 'space-y-4' : 'space-y-8'
              } ${isMobile || isTablet ? 'order-1' : ''}`} 
              variants={itemVariants}
              transition={itemTransition}
            >
              {/* Introduction */}
              <div className={isMobile && isLandscape ? 'space-y-2' : 'space-y-4'}>
                <h3 className={`${
                  isMobile ? 'text-xl' : isTablet ? 'text-xl' : 'text-2xl'
                } font-bold text-foreground`}>
                  Passionate Developer & Problem Solver
                </h3>
                <div className={`${
                  isMobile && isLandscape ? 'space-y-2' : 'space-y-4'
                } text-muted-foreground leading-relaxed ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}>
                  <p>
                    Hi! I&apos;m John, a passionate full-stack developer with a love for creating
                    beautiful, functional applications. My journey in programming started with
                    curiosity and has evolved into a deep passion for crafting digital experiences
                    that make a difference.
                  </p>
                  <p>
                    I specialize in modern web technologies like <span className="text-primary font-semibold">React</span>,
                    <span className="text-primary font-semibold"> Next.js</span>, and
                    <span className="text-primary font-semibold"> TypeScript</span>, as well as mobile
                    development with <span className="text-primary font-semibold">Flutter</span>.
                    I believe in writing clean, maintainable code and creating user experiences
                    that are both intuitive and delightful.
                  </p>
                  <p>
                    When I&apos;m not coding, you&apos;ll find me exploring new technologies, contributing
                    to open-source projects, or sharing knowledge with the developer community.
                    I&apos;m always excited to take on new challenges and collaborate on innovative projects.
                  </p>
                </div>
              </div>

              {/* Interests */}
              <div>
                <h4 className={`${
                  isMobile ? 'text-base' : 'text-lg'
                } font-semibold text-foreground ${
                  isMobile && isLandscape ? 'mb-2' : 'mb-4'
                }`}>What I&apos;m passionate about</h4>
                <div className={`grid ${
                  isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-3'
                }`}>
                  {interests.map((interest) => (
                    <motion.div
                      key={interest.label}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background/30 border border-border/30"
                      whileHover={!hasCoarsePointer ? { scale: 1.02, backgroundColor: "rgba(var(--background), 0.5)" } : {}}
                      transition={{ duration: 0.2 }}
                      style={{ 
                        minHeight: hasCoarsePointer ? '44px' : 'auto'
                      }}
                    >
                      <interest.icon className={`w-5 h-5 ${interest.color}`} />
                      <span className="text-sm font-medium text-foreground">{interest.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Timeline Section */}
          <motion.div 
            className={isMobile && isLandscape ? 'mt-8' : 'mt-20'} 
            variants={itemVariants}
            transition={itemTransition}
          >
            <h3 className={`${
              isMobile ? 'text-xl' : 'text-2xl'
            } font-bold text-center text-foreground ${
              isMobile && isLandscape ? 'mb-6' : 'mb-12'
            }`}>
              My Journey
            </h3>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary to-secondary" />

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                      }`}
                    variants={itemVariants}
                    transition={itemTransition}
                  >
                    {/* Content */}
                    <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <motion.div
                        className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 shadow-sm"
                        whileHover={{ scale: 1.02, y: -4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="text-primary font-bold text-lg mb-2">{milestone.year}</div>
                        <h4 className="font-semibold text-foreground mb-2">{milestone.title}</h4>
                        <p className="text-muted-foreground text-sm">{milestone.description}</p>
                      </motion.div>
                    </div>

                    {/* Timeline dot */}
                    <div className="relative z-10">
                      <motion.div
                        className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg"
                        whileHover={{ scale: 1.5 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}