import React from 'react';
import { pricingPlans } from '../data/mock';
import { Button } from './ui/button';
import { Check, Sparkles } from 'lucide-react';

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 lg:py-32 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-purple-400 font-semibold mb-4 tracking-wider uppercase">Pricing</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Simple, </span>
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              transparent
            </span>
            <span className="text-white"> pricing</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core AI writing features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-purple-500/10 to-cyan-500/10 border-purple-500/50'
                  : 'bg-[#2a2a2a] border-gray-800 hover:border-gray-700'
              }`}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl lg:text-5xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>

              {/* CTA Button */}
              <Button
                className={`w-full mb-8 ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {plan.cta}
              </Button>

              {/* Features List */}
              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      plan.highlighted ? 'text-cyan-400' : 'text-purple-400'
                    }`} />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Affiliate Banner */}
        <div className="mt-16 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl p-8 border border-purple-500/30 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Earn up to 30% Lifetime Commission as an Affiliate!
          </h3>
          <p className="text-gray-400 mb-6">
            Join our affiliate program and earn recurring commissions.
          </p>
          <Button
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-black"
          >
            Become an Affiliate
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
