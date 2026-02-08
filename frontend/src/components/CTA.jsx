import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 lg:py-32 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 mb-8">
          <Sparkles className="w-8 h-8 text-cyan-400" />
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          <span className="text-white">Ready to </span>
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            supercharge
          </span>
          <span className="text-white"> your content?</span>
        </h2>

        <p className="text-gray-400 text-lg lg:text-xl mb-10 max-w-2xl mx-auto">
          Join 50,000+ businesses using HYDRASEO to create SEO-optimized content
          that ranks on Google and gets cited in AI engines.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white text-lg px-10 py-6 rounded-lg shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:scale-105 group"
          >
            Start Writing For Free
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-black text-lg px-10 py-6 rounded-lg transition-all hover:scale-105"
          >
            View Pricing
          </Button>
        </div>

        {/* Trust Note */}
        <p className="mt-8 text-gray-500 text-sm">
          No credit card required • Free forever plan available
        </p>
      </div>
    </section>
  );
};

export default CTA;
