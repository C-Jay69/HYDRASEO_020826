import React from 'react';
import { benefits } from '../data/mock';
import { Button } from './ui/button';
import { ArrowRight, Rocket, Clock, Globe, Users } from 'lucide-react';

const iconMap = {
  '10x': Rocket,
  '500%': Clock,
  '48+': Globe,
  '50K+': Users,
};

const Benefits = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-cyan-400 font-semibold mb-4 tracking-wider uppercase">Why Wait?</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Why wait to take </span>
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              advantage?
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get words for free right now and save money on your content
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {benefits.map((benefit, index) => {
            const IconComponent = iconMap[benefit.value] || Rocket;
            return (
              <div
                key={index}
                className="group relative bg-[#2a2a2a]/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 text-center border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2"
              >
                {/* Icon */}
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6 text-cyan-400" />
                </div>
                
                {/* Value */}
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {benefit.value}
                </div>
                
                {/* Label */}
                <p className="text-gray-400 text-sm lg:text-base">{benefit.label}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white text-lg px-8 py-6 rounded-lg shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:scale-105 group"
          >
            Get Started for Free
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
