"use client";
import { motion } from 'motion/react';
import { TrendingUp, BookOpen, Globe, Users, ArrowRight, Brain, Briefcase, Shield, Atom } from 'lucide-react';

export default function Home() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="z-10"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              Open Access Learning
            </span>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-on-surface leading-[1.1] tracking-tight mb-8">
              Education for Everyone, <span className="text-primary italic">Everywhere.</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed mb-10 max-w-xl">
              Democratizing knowledge through premium, accessible resources. Join a global community of learners and scholars in our luminous digital sanctuary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-primary text-white px-8 py-4 rounded-xl font-headline font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/25">
                Get Started
              </button>
              <button className="bg-white text-on-surface px-8 py-4 rounded-xl font-headline font-bold text-lg hover:bg-slate-50 transition-colors border border-slate-200">
                Learn More
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
              <img 
                src="https://picsum.photos/seed/student/800/800" 
                alt="Student studying" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl max-w-xs hidden md:block">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Active Learners</p>
                  <p className="text-2xl font-headline font-extrabold">2.4M+</p>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-secondary"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-headline font-bold text-on-surface mb-6">Built for Intellectual Growth</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">We provide the tools, the community, and the platform. You provide the curiosity.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-shadow group">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <BookOpen className="text-primary mb-6" size={40} />
                  <h3 className="text-3xl font-headline font-bold mb-4">Curated Curriculum</h3>
                  <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">Our courses are designed by world-class educators from leading institutions, ensuring every lesson meets the highest academic standards.</p>
                </div>
                <div className="mt-12 flex -space-x-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-slate-200">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Instructor" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center bg-primary text-white text-xs font-bold">+120</div>
                </div>
              </div>
            </div>

            <div className="bg-secondary p-10 rounded-3xl text-white shadow-lg flex flex-col justify-between">
              <Globe size={40} className="mb-6" />
              <div>
                <h3 className="text-2xl font-headline font-bold mb-4">Zero Barriers</h3>
                <p className="opacity-90 leading-relaxed">Financial status should never dictate intellectual potential. Our platform remains 100% free, forever.</p>
              </div>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-shadow">
              <Users className="text-secondary mb-6" size={40} />
              <h3 className="text-2xl font-headline font-bold mb-4">Peer Learning</h3>
              <p className="text-on-surface-variant">Join study groups and collaborative research circles spanning 140+ countries.</p>
            </div>

            <div className="md:col-span-2 relative overflow-hidden bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-shadow flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1">
                <h3 className="text-2xl font-headline font-bold mb-4">Certificates of Excellence</h3>
                <p className="text-on-surface-variant mb-6">Earn verified credentials recognized by global employers and academic organizations.</p>
                <button className="text-primary font-bold flex items-center gap-2 group hover:gap-4 transition-all">
                  View Accreditation <ArrowRight size={20} />
                </button>
              </div>
              <div className="flex-1 aspect-video rounded-xl overflow-hidden bg-slate-100">
                <img 
                  src="https://picsum.photos/seed/classroom/600/400" 
                  alt="Classroom" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-headline font-bold text-on-surface mb-4">Start Your Journey</h2>
              <p className="text-on-surface-variant max-w-xl">Explore our most popular departments and find the path that speaks to your future.</p>
            </div>
            <button className="bg-slate-100 text-on-surface-variant px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors">
              View All Categories
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Applied AI", icon: Brain, courses: 48, img: "ai" },
              { title: "Digital Economy", icon: Briefcase, courses: 32, img: "business" },
              { title: "Ethics & Policy", icon: Shield, courses: 24, img: "security" },
              { title: "Natural Science", icon: Atom, courses: 56, img: "science" },
            ].map((program) => (
              <div key={program.title} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/${program.img}/400/300`} 
                    alt={program.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-headline font-bold mb-2">{program.title}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary font-bold text-sm">{program.courses} Courses</span>
                    <button className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-primary p-12 md:p-20 rounded-[3rem] text-white text-center relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-headline font-extrabold mb-8">Ready to expand your horizons?</h2>
              <p className="text-xl md:text-2xl opacity-90 mb-12">Join millions of students already learning on Luminous Academy. It only takes 30 seconds to sign up.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button className="bg-white text-primary px-10 py-5 rounded-2xl font-headline font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl">
                  Create Free Account
                </button>
                <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-headline font-bold text-xl hover:bg-white/20 transition-all">
                  Browse Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
