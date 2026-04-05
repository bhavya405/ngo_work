"use client";
import { motion } from 'motion/react';
import { Sparkles, Globe, GraduationCap, Users, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-headline font-semibold text-sm tracking-wide">OUR MISSION</span>
          <h1 className="text-5xl lg:text-7xl font-headline font-extrabold leading-[1.1] text-on-surface">
            Democratizing <span className="text-primary italic">knowledge</span> for every mind.
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed max-w-xl">
            Luminous Academy is a sanctuary for intellectual growth. We believe high-quality education should never be a privilege of the few, but a right accessible to all.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] relative z-10">
            <img 
              src="https://picsum.photos/seed/about/800/1000" 
              alt="Learning together" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-secondary/10 rounded-2xl -z-10"></div>
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full -z-10"></div>
        </motion.div>
      </section>

      {/* Vision Section */}
      <section className="bg-surface-container-low py-24">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-4xl font-headline font-bold mb-6">Our Vision</h2>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              To build a global infrastructure of curiosity where barriers—financial, geographical, or social—do not exist. We envision a world where a learner's potential is only limited by their will to explore.
            </p>
          </div>
          <div className="lg:col-span-7 grid md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <Sparkles className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-headline font-bold mb-3">Academic Excellence</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Curating university-grade content that challenges and inspires deep mastery of complex subjects.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <Globe className="text-secondary mb-4" size={32} />
              <h3 className="text-xl font-headline font-bold mb-3">Radical Openness</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">No paywalls, no hidden fees. Our entire library and network are free, permanently.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="max-w-7xl mx-auto px-8 py-32">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-headline font-extrabold tracking-tight">What We Do</h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">Connecting expert mentors with eager minds to bridge the gap between curiosity and expertise.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
          <div className="md:col-span-2 md:row-span-2 bg-slate-100 rounded-2xl overflow-hidden relative group">
            <img 
              src="https://picsum.photos/seed/mentorship/800/1200" 
              alt="Mentorship" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-2xl font-headline font-bold text-white mb-2">Direct Mentorship</h3>
              <p className="text-white/80 text-sm">One-on-one sessions between industry veterans and aspiring students.</p>
            </div>
          </div>
          
          <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 flex flex-col justify-center shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-2xl font-headline font-bold">Curated Pathways</h3>
            </div>
            <p className="text-on-surface-variant">We don't just provide content; we design structured learning journeys tailored to specific career and academic outcomes.</p>
          </div>
          
          <div className="md:col-span-1 bg-primary text-white p-8 rounded-2xl flex flex-col justify-center">
            <span className="text-4xl font-headline font-extrabold mb-2">50k+</span>
            <p className="text-white/80 text-sm font-medium">Monthly Active Learners</p>
          </div>
          
          <div className="md:col-span-1 bg-secondary text-white p-8 rounded-2xl flex flex-col justify-center">
            <span className="text-4xl font-headline font-extrabold mb-2">200+</span>
            <p className="text-white/80 text-sm font-medium">Expert Educators</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-surface py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl font-headline font-bold mb-4">How It Works</h2>
              <p className="text-on-surface-variant">Getting started at Luminous Academy is simple by design. Our platform eliminates the friction often found in traditional admissions.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Discover Your Path", desc: "Browse our extensive library of disciplines, from quantum mechanics to creative literature." },
              { step: "02", title: "Connect with Mentors", desc: "Join live seminar groups or request a specific mentor for personalized guidance." },
              { step: "03", title: "Master and Contribute", desc: "Once you master a subject, you are invited to join our circle of mentors." },
            ].map((item) => (
              <div key={item.step} className="relative space-y-6 group">
                <div className="text-8xl font-headline font-extrabold text-slate-100 absolute -top-10 -left-4 -z-10 group-hover:text-primary/5 transition-colors">{item.step}</div>
                <h3 className="text-2xl font-headline font-bold pt-4">{item.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{item.desc}</p>
                <div className="flex items-center gap-2 text-primary font-bold cursor-pointer">
                  <span>Learn More</span>
                  <ArrowRight size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
