/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T18:30:00
 * Last Updated: 2025-12-23T18:25:14
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import { Menu, X } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';

// Inline Icon Components
const ArrowRightIcon = ({ className = '', size = 16 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

// Navigation Component
const Navigation = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 w-full z-50 border-b border-gray-800/50 bg-black/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-white">Your SaaS</div>

          <div className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-sm text-white/60 hover:text-white transition-colors">
              About
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              Sign in
            </Button>
            <Button variant="default" size="sm" className="bg-white text-black hover:bg-gray-100">
              Sign Up
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800/50 animate-in slide-in-from-top-2 duration-300">
          <div className="px-6 py-4 flex flex-col gap-4">
            <a
              href="#features"
              className="text-sm text-white/60 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-white/60 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-sm text-white/60 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-800/50">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                Sign in
              </Button>
              <Button variant="default" size="sm" className="bg-white text-black hover:bg-gray-100">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

Navigation.displayName = 'Navigation';

// Hero Component
const Hero = React.memo(() => {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-start px-6 py-20 md:py-24"
      style={{
        animation: 'fadeIn 0.6s ease-out',
      }}
    >
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        * {
          font-family: 'Poppins', sans-serif;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}
      </style>

      <aside className="mb-8 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-800/50 backdrop-blur-sm max-w-full animate-in fade-in duration-700">
        <span className="text-xs text-center whitespace-nowrap text-gray-300">
          🚀 New AI features now available!
        </span>
        <a
          href="#new-features"
          className="flex items-center gap-1 text-xs hover:text-white transition-all active:scale-95 whitespace-nowrap text-gray-400 hover:text-gray-200"
          aria-label="Read more about new features"
        >
          Read more
          <ArrowRightIcon size={12} />
        </a>
      </aside>

      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-medium text-center max-w-4xl px-6 leading-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200"
        style={{
          background: 'linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.05em',
        }}
      >
        Transform Your Workflow
        {' '}
        <br />
        with Next-Gen SaaS
      </h1>

      <p className="text-sm md:text-base text-center max-w-2xl px-6 mb-10 text-gray-400 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        Boost productivity by 10x with our AI-powered platform. Built for modern teams who demand excellence and innovation.
      </p>

      <div className="flex items-center gap-4 relative z-10 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
        <Button
          size="lg"
          className="bg-gradient-to-b from-white via-white/95 to-white/60 text-black hover:scale-105 active:scale-95 transition-all duration-200 rounded-lg flex items-center justify-center gap-2 px-8"
          aria-label="Get started with the platform"
        >
          Get Started Free
          <ArrowRightIcon size={16} />
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="border-gray-600 text-white hover:bg-gray-800/50 hover:border-gray-500 transition-all duration-200 rounded-lg px-8"
        >
          Watch Demo
        </Button>
      </div>

      <div className="w-full max-w-6xl relative pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
        <div
          className="absolute left-1/2 w-[95%] pointer-events-none z-0 opacity-60"
          style={{
            top: '-25%',
            transform: 'translateX(-50%)',
          }}
          aria-hidden="true"
        >
          <div className="w-full h-96 bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-4 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Modern SaaS dashboard showing analytics, charts, and productivity tools"
              className="w-full h-auto rounded-xl shadow-2xl"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="flex items-center justify-center gap-8 mt-8 opacity-60 animate-in fade-in duration-700 delay-1000">
        <span className="text-xs text-gray-500 uppercase tracking-wider">Trusted by</span>
        <div className="flex items-center gap-6">
          <div className="text-gray-400 text-sm font-medium">Company A</div>
          <div className="text-gray-400 text-sm font-medium">Company B</div>
          <div className="text-gray-400 text-sm font-medium">Company C</div>
          <div className="text-gray-400 text-sm font-medium">Company D</div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

// Main Component
export const ModernSaaSHero = () => {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Navigation />
      <Hero />
    </main>
  );
};
