import React, { useState } from 'react';
import { howItWorks } from '../data/mock';
import { Button } from './ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(1);

  const stepContent = {
    1: {
      title: 'Choose Your Tool',
      description: 'Create the perfect article using only Title, generate and publish it in 1 click. Run Bulk Article Generation and auto-post up to 100 articles in a batch to WordPress automatically.',
      highlights: ['1-Click Article Generation', 'Bulk Mode (100+ articles)', 'Auto WordPress Publishing'],
    },
    2: {
      title: 'Enter Your Keywords',
      description: 'Specify your Main keyword. In 1 click, generate a Title for the article. Choose language, article size, tone of voice. Enable Image Generation and automatically generate NLP keywords.',
      highlights: ['48+ Languages', 'Multiple Tones of Voice', 'NLP Keyword Generation'],
    },
    3: {
      title: 'Generate & Publish',
      description: 'Launch generation with 1 click by pressing the Run button. Get interesting and structured articles with high SEO rating. Speed up content creation with our powerful AI.',
      highlights: ['Instant Generation', 'High SEO Scores', 'Auto-Publishing'],
    },
  };

  const currentContent = stepContent[activeStep];

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-purple-400 font-semibold mb-4 tracking-wider uppercase">How It Works</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="text-white">How easy is our </span>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              platform to use?
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Step Tabs */}
          <div className="space-y-4">
            {howItWorks.map((step) => (
              <button
                key={step.step}
                onClick={() => setActiveStep(step.step)}
                className={`w-full text-left p-6 rounded-xl border transition-all duration-300 ${
                  activeStep === step.step
                    ? 'bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/50'
                    : 'bg-[#2a2a2a] border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      activeStep === step.step
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    <span className="text-lg font-bold">{step.step}</span>
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-2 transition-colors ${
                        activeStep === step.step ? 'text-white' : 'text-gray-300'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{step.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right Side - Active Step Content */}
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900 to-[#2a2a2a] rounded-2xl p-8 border border-gray-800">
              {/* Step Indicator */}
              <div className="inline-flex items-center gap-2 bg-purple-500/20 rounded-full px-4 py-1 mb-6">
                <span className="text-purple-400 font-semibold">Step {activeStep}</span>
              </div>

              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                {currentContent.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {currentContent.description}
              </p>

              {/* Highlights */}
              <div className="space-y-3 mb-8">
                {currentContent.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    <span className="text-gray-300">{highlight}</span>
                  </div>
                ))}
              </div>

              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white group">
                Try it now for free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
