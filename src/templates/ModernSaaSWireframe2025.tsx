/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T18:40:00
 * Last Updated: 2025-12-23T19:40:08
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Menu, X, Check, Shield, Users, Zap, Star, ArrowDown, Play } from 'lucide-react';
import { HeroScrollDemo } from '@/components/ui/demo';

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

// ====================================
// 1. Header - Cognitive Tunneling Zone
// ====================================
const Header = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">SaaSFlow</div>

          {/* No global navigation - cognitive tunneling */}

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="default"
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started Free
              <ArrowRightIcon size={18} className="ml-2" />
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50 animate-in slide-in-from-top-2 duration-300">
          <div className="px-6 py-4 flex flex-col gap-4">
            <Button
              variant="default"
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            >
              Get Started Free
              <ArrowRightIcon size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
});

Header.displayName = 'Header';

// ====================================
// 2. Hero Section - Hook Test (3-5 seconds)
// ====================================
const HeroSection = React.memo(() => {
  const [_isVideoPlaying, setIsVideoPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Announcement Badge */}
          <Badge variant="secondary" className="mb-8 px-4 py-2 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200">
            🚀 New AI features now available
          </Badge>

          {/* Main Headline - Benefit Focused */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Cut reporting time by
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}50%
            </span>
          </h1>

          {/* Subtitle - Mechanism Explanation */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Automate routine tasks with our AI assistant.
            Focus on what really matters for your business.
          </p>

          {/* Social Proof */}
          <div className="mb-10">
            <p className="text-sm text-gray-500 mb-4">Trusted by 5000+ companies</p>
            <div className="flex items-center justify-center gap-8 opacity-70">
              <div className="text-sm font-medium">Company A</div>
              <div className="text-sm font-medium">Company B</div>
              <div className="text-sm font-medium">Company C</div>
              <div className="text-sm font-medium">Company D</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started Free
              <ArrowRightIcon size={20} className="ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg border-2 hover:bg-gray-50 transition-all duration-200"
            >
              <Play size={20} className="mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Video Hero */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Placeholder for video - in real implementation you'd use actual video */}
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Play size={32} className="text-white ml-1" />
                  </div>
                  <p className="text-gray-600 font-medium">60-90 second product demonstration</p>
                  <p className="text-sm text-gray-500 mt-2">Up to 86% conversion with video demonstration</p>
                </div>

                {/* Play button overlay */}
                <button
                  onClick={handlePlayVideo}
                  className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all duration-200"
                >
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                    <Play size={24} className="text-gray-900 ml-1" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

// ====================================
// 3. The Villain - PAS Model (Problem, Agitate, Stakes)
// ====================================
const TheVillain = React.memo(() => {
  return (
    <section className="py-24 bg-red-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Problem Identification */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Are you spending hours on
            <span className="text-red-600"> routine reports</span>?
          </h2>

          <p className="text-xl text-gray-700 mb-12 leading-relaxed">
            Spreadsheet chaos, endless formulas, calculation errors...
            This takes time you could spend on growing your business.
          </p>

          {/* Agitation - Stakes */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowDown className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Revenue Loss</h3>
              <p className="text-gray-600">Every delay day = thousands in lost revenue</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Security Risks</h3>
              <p className="text-gray-600">Report errors can cost you dearly</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Burnout</h3>
              <p className="text-gray-600">Routine work drains your best employees</p>
            </div>
          </div>

          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            The solution exists - try it now
            <ArrowRightIcon size={20} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
});

TheVillain.displayName = 'TheVillain';

// ====================================
// 4. The Guide - Authority & Empathy
// ====================================
const TheGuide = React.memo(() => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Empathy */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              We understand how difficult it is to
              <span className="text-blue-600"> manage a remote team</span>
            </h2>

            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              8 years of SaaS experience. We've gone through all the difficulties
              you're experiencing now. And we know how to fix it.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Check className="text-green-600 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">5000+ satisfied customers</h3>
                  <p className="text-gray-600">From startups to Fortune 500 companies</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Check className="text-green-600 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">99.9% uptime</h3>
                  <p className="text-gray-600">Your work never stops</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Check className="text-green-600 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">GDPR & ISO 27001</h3>
                  <p className="text-gray-600">Your data is secure</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Authority */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Trusted by leading companies</h3>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-yellow-400" size={16} />
                  <span className="font-semibold text-sm">4.9/5</span>
                </div>
                <p className="text-xs text-gray-600">G2 Crowd</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-yellow-400" size={16} />
                  <span className="font-semibold text-sm">4.8/5</span>
                </div>
                <p className="text-xs text-gray-600">Capterra</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-sm font-medium">Microsoft</span>
                <Badge variant="secondary">Enterprise</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-sm font-medium">Google</span>
                <Badge variant="secondary">Enterprise</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-sm font-medium">Amazon</span>
                <Badge variant="secondary">Enterprise</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

TheGuide.displayName = 'TheGuide';

// ====================================
// 5. The Plan - Reduce Friction (3-4 Steps)
// ====================================
const ThePlan = React.memo(() => {
  return (
    <section className="py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get started in <span className="text-blue-400">4 simple steps</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            No implementation complexity. We've eliminated all barriers on your path to success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3">Sign Up</h3>
            <p className="text-gray-300">Free, no credit card, in 30 seconds</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3">Connect Your Data</h3>
            <p className="text-gray-300">Integration with Excel, Google Sheets, API</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3">Set Up Automation</h3>
            <p className="text-gray-300">AI automatically understands your processes</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
              4
            </div>
            <h3 className="text-xl font-semibold mb-3">Get Results</h3>
            <p className="text-gray-300">First reports ready in 5 minutes</p>
          </div>
        </div>

        <div className="text-center mt-16">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start now - it's free
            <ArrowRightIcon size={20} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
});

ThePlan.displayName = 'ThePlan';

// ====================================
// 6. Value Stack - BAB Model (Before, After, Bridge)
// ====================================
const ValueStack = React.memo(() => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            From chaos to <span className="text-blue-600">perfect order</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how work changes with our tools
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Before */}
          <div className="text-center">
            <div className="bg-red-50 rounded-2xl p-8 mb-6">
              <h3 className="text-2xl font-bold text-red-600 mb-4">BEFORE</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <X className="text-red-500" size={20} />
                  <span className="text-gray-700">Hours on routine reports</span>
                </div>
                <div className="flex items-center gap-3">
                  <X className="text-red-500" size={20} />
                  <span className="text-gray-700">Calculation errors</span>
                </div>
                <div className="flex items-center gap-3">
                  <X className="text-red-500" size={20} />
                  <span className="text-gray-700">Team stress and burnout</span>
                </div>
                <div className="flex items-center gap-3">
                  <X className="text-red-500" size={20} />
                  <span className="text-gray-700">Delays in decision making</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bridge - Our Solution */}
          <div className="text-center">
            <div className="bg-blue-50 rounded-2xl p-8 mb-6 border-2 border-blue-200">
              <Zap className="text-blue-600 mx-auto mb-4" size={48} />
              <h3 className="text-2xl font-bold text-blue-600 mb-4">SaaSFlow</h3>
              <p className="text-gray-700 mb-4">
                AI automation of all routine processes
              </p>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Try it now
              </Button>
            </div>
          </div>

          {/* After */}
          <div className="text-center">
            <div className="bg-green-50 rounded-2xl p-8 mb-6">
              <h3 className="text-2xl font-bold text-green-600 mb-4">AFTER</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className="text-gray-700">Automatic reports in minutes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className="text-gray-700">100% calculation accuracy</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className="text-gray-700">Happy and productive team</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className="text-gray-700">Fast and data-driven decisions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real Screenshots */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Real interface screenshots
          </h3>
          <div className="bg-gray-100 rounded-2xl p-8 text-center">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Dashboard</h4>
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-48 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600">Real dashboard screenshot</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Automation</h4>
                <div className="bg-gradient-to-br from-green-100 to-blue-100 h-48 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600">Real automation screenshot</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

ValueStack.displayName = 'ValueStack';

// ====================================
// 7. Pricing Table - Anchor Effect
// ====================================
const PricingTable = React.memo(() => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple and transparent <span className="text-blue-600">pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            3 plans for different stages of your business growth
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">For small teams</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-600">/month</span>
              </div>

              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={18} />
                  <span className="text-gray-700">Up to 5 users</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={18} />
                  <span className="text-gray-700">Basic reports</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={18} />
                  <span className="text-gray-700">Email support</span>
                </li>
              </ul>

              <Button variant="outline" className="w-full">
                Get Started Free
              </Button>
            </div>
          </div>

          {/* Pro Plan - Highlighted */}
          <div className="bg-blue-600 rounded-2xl p-8 shadow-xl text-white relative transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-yellow-400 text-yellow-900 font-semibold">
                Best Value
              </Badge>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-blue-100 mb-6">For growing companies</p>

              <div className="mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-blue-100">/month</span>
              </div>

              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center gap-3">
                  <Check className="text-green-300" size={18} />
                  <span>Up to 25 users</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-300" size={18} />
                  <span>Advanced reports</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-300" size={18} />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-300" size={18} />
                  <span>API integrations</span>
                </li>
              </ul>

              <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                Try 14 days
              </Button>
            </div>
          </div>

          {/* Enterprise Plan - Anchor */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">For large corporations</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$299</span>
                <span className="text-gray-600">/month</span>
              </div>

              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={18} />
                  <span className="text-gray-700">Unlimited users</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={18} />
                  <span className="text-gray-700">All features included</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={18} />
                  <span className="text-gray-700">24/7 support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500" size={18} />
                  <span className="text-gray-700">Dedicated manager</span>
                </li>
              </ul>

              <Button variant="outline" className="w-full">
                Contact us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

PricingTable.displayName = 'PricingTable';

// ====================================
// 8. FAQ - Objection Handling
// ====================================
const FAQ = React.memo(() => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Answers to the most common questions about our product
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="security" className="border border-gray-200 rounded-lg px-6">
            <AccordionTrigger className="text-left hover:no-underline">
              Is my data secure?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Yes, we use 256-bit encryption, comply with GDPR and ISO 27001 standards.
              Your data is protected at bank-level security.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="refund" className="border border-gray-200 rounded-lg px-6">
            <AccordionTrigger className="text-left hover:no-underline">
              Is there a money-back guarantee?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Yes, we provide a 30-day money-back guarantee. If the product doesn't work for you,
              we'll refund 100% of your payment, no questions asked.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="integration" className="border border-gray-200 rounded-lg px-6">
            <AccordionTrigger className="text-left hover:no-underline">
              Does it integrate with our systems?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Yes, we have ready integrations with Excel, Google Sheets, Slack, Zapier and API for custom solutions.
              Implementation takes from 5 minutes to 2 hours depending on complexity.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="support" className="border border-gray-200 rounded-lg px-6">
            <AccordionTrigger className="text-left hover:no-underline">
              What level of support do you provide?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Starter plan: email support within 24 hours.
              Professional: priority support within 4 hours.
              Enterprise: 24/7 support with dedicated manager.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Didn't find the answer to your question?</p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Contact support
          </Button>
        </div>
      </div>
    </section>
  );
});

FAQ.displayName = 'FAQ';

// ====================================
// 9. Footer - Final CTA & Mega Footer
// ====================================
const Footer = React.memo(() => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Final CTA */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your business?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join 5000+ companies that have already automated their processes
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Get started free today
            <ArrowRightIcon size={20} className="ml-2" />
          </Button>
        </div>

        {/* Mega Footer */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 SaaSFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

// ====================================
// Sticky CTA for Mobile Optimization
// ====================================
const StickyCTA = React.memo(() => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 md:hidden z-50 shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div>
          <p className="font-semibold text-sm">Cut reporting time by 50%</p>
          <p className="text-xs text-blue-100">Free, no credit card</p>
        </div>
        <Button
          size="sm"
          className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 text-sm font-medium"
        >
          Start
        </Button>
      </div>
    </div>
  );
});

StickyCTA.displayName = 'StickyCTA';

// ====================================
// Main Component - Wireframe 2025
// ====================================
export const ModernSaaSWireframe2025 = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <HeroScrollDemo />
      <TheVillain />
      <TheGuide />
      <ThePlan />
      <ValueStack />
      <PricingTable />
      <FAQ />
      <Footer />
      <StickyCTA />
    </div>
  );
};
