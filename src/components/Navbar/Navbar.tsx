'use client'; // Required for hooks in Next.js App Router

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Next.js equivalent of useLocation
import { motion } from 'motion/react';
// Assuming you have a utility for class merging like 'clsx' or 'tailwind-merge'
import { cn } from "@/lib/utils"; 

export default function Navbar() {
  const pathname = usePathname(); // Get the current path

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Donors', path: '/Donations' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        {/* Next.js uses 'href' instead of 'to' */}
        <Link href="/" className="text-xl font-bold text-slate-900 font-headline tracking-tight">
          Luminous Academy
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 font-headline tracking-tight font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                "transition-colors pb-1 border-b-2",
                // Check if active using pathname
                pathname === link.path
                  ? "text-primary border-primary"
                  : "text-slate-600 border-transparent hover:text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <Link 
          href="/Donations"
          className="bg-primary hover:scale-105 active:scale-95 transition-all duration-200 text-white px-6 py-2.5 rounded-xl font-headline font-bold text-sm shadow-lg shadow-primary/20"
        >
          Donate Now
        </Link>
      </div>
    </nav>
  );
}