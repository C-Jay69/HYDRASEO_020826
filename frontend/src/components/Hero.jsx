import React from 'react';
import { Button } from './ui/button';
import { Play, Star, ArrowRight } from 'lucide-react';
import { trustBadges } from '../data/mock';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900/50 via-black to-black" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              {trustBadges.map((badge, index) => (
                <div
                  key={badge.name}
                  className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-800 hover:border-gray-700 transition-all hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-sm font-medium text-gray-400">{badge.name}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-white">{badge.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">({badge.reviews})</span>
                </div>
              ))}
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">SEO Writing.</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Rank Higher.
              </span>
              <br />
              <span className="text-white">More Traffic.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg lg:text-xl text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
              The only platform that auto-analyzes SERP competitors and generates content
              optimized for both traditional search and AI engines (ChatGPT, Perplexity, Google AI)
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white text-lg px-8 py-6 rounded-lg shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:scale-105 group"
              >
                Get Started – It's Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 rounded-lg transition-all hover:scale-105 group"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* User Count */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-black bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-xs font-bold text-white"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-gray-400">
                Join <span className="text-white font-semibold">50,000+</span> businesses worldwide
              </p>
            </div>
          </div>

          {/* Right Content - Video/Image Placeholder */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-2xl shadow-purple-500/10">
              {/* Video Thumbnail */}
              <div className="aspect-video relative group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwxfHxTRU8lMjBhbmFseXRpY3N8ZW58MHx8fHwxNzcwNTc3MDYyfDA&ixlib=rb-4.1.0&q=85"
                  alt="HYDRASEO Dashboard"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg px-4 py-2 shadow-lg">
                <span className="text-white font-semibold text-sm">1-Click Publishing</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border border-purple-500/30 rounded-lg transform -rotate-6" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
