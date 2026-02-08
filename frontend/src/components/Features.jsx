import React from 'react';
import { features } from '../data/mock';
import { FileText, ShoppingCart, TrendingUp, Zap, Layers, FolderOpen } from 'lucide-react';

const iconMap = {
  FileText,
  ShoppingCart,
  TrendingUp,
  Zap,
  Layers,
  FolderOpen,
};

const Features = () => {
  return (
    <section id="features" className="py-20 lg:py-32 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="text-cyan-400 font-semibold mb-4 tracking-wider uppercase">Powerful Features</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">User-friendly solution to</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              generate content
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            With just a few minutes, you can create unique, highly converting content
            that will help you succeed in your marketing business.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <div
                key={feature.id}
                className="group relative bg-[#2a2a2a] rounded-xl p-6 lg:p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-cyan-500/30 transition-colors">
                    <IconComponent className="w-7 h-7 text-cyan-400" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="relative text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="relative text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-xl">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent transform translate-x-8 -translate-y-8" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
