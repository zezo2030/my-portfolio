"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(100, "Subject must be less than 100 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters")
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema)
  });

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

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real application, you would send the data to your backend
      console.log('Form submitted:', data);
      
      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
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

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/johndoe",
      color: "hover:text-gray-900 dark:hover:text-gray-100"
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/johndoe",
      color: "hover:text-blue-600"
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "https://twitter.com/johndoe",
      color: "hover:text-blue-400"
    }
  ];

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center py-20" aria-labelledby="contact-heading">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div className="text-center mb-16" variants={itemVariants} transition={itemTransition}>
            <h2 id="contact-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Ready to bring your ideas to life? Let&apos;s discuss your next project and create something amazing together.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Information */}
            <motion.div className="space-y-8" variants={itemVariants} transition={itemTransition}>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Let&apos;s Start a Conversation
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  I&apos;m always excited to work on new projects and collaborate with talented individuals. 
                  Whether you have a specific project in mind or just want to explore possibilities, 
                  I&apos;d love to hear from you.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <motion.div
                    key={info.label}
                    className="flex items-center gap-4 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300"
                    whileHover={{ scale: 1.02, x: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="font-medium text-foreground">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4">Follow Me</h4>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg flex items-center justify-center text-muted-foreground transition-all duration-300 ${social.color}`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants} transition={itemTransition}>
              <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
                <h3 className="text-xl font-bold text-foreground mb-6">Send Me a Message</h3>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Name *
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-foreground placeholder-muted-foreground"
                      placeholder="Your full name"
                      aria-required="true"
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1 text-sm text-red-500 flex items-center gap-1" role="alert">
                        <AlertCircle className="w-4 h-4" aria-hidden="true" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-foreground placeholder-muted-foreground"
                      placeholder="your.email@example.com"
                      aria-required="true"
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-sm text-red-500 flex items-center gap-1" role="alert">
                        <AlertCircle className="w-4 h-4" aria-hidden="true" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <input
                      {...register("subject")}
                      type="text"
                      id="subject"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-foreground placeholder-muted-foreground"
                      placeholder="What's this about?"
                      aria-required="true"
                      aria-invalid={errors.subject ? 'true' : 'false'}
                      aria-describedby={errors.subject ? 'subject-error' : undefined}
                    />
                    {errors.subject && (
                      <p id="subject-error" className="mt-1 text-sm text-red-500 flex items-center gap-1" role="alert">
                        <AlertCircle className="w-4 h-4" aria-hidden="true" />
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <textarea
                      {...register("message")}
                      id="message"
                      rows={5}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-foreground placeholder-muted-foreground resize-none"
                      placeholder="Tell me about your project or idea..."
                      aria-required="true"
                      aria-invalid={errors.message ? 'true' : 'false'}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                    />
                    {errors.message && (
                      <p id="message-error" className="mt-1 text-sm text-red-500 flex items-center gap-1" role="alert">
                        <AlertCircle className="w-4 h-4" aria-hidden="true" />
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative overflow-hidden group"
                    size="lg"
                    aria-label={isSubmitting ? "Sending message..." : "Send message"}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            aria-hidden="true"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                          Send Message
                        </>
                      )}
                    </span>
                  </Button>

                  {/* Success/Error Messages */}
                  {submitStatus === 'success' && (
                    <motion.div
                      className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Message sent successfully! I&apos;ll get back to you soon.</span>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="w-5 h-5" />
                      <span>Failed to send message. Please try again or contact me directly.</span>
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}