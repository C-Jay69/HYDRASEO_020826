import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Check, Sparkles, Zap, Users, Building2 } from 'lucide-react';

const PricingPage = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for trying out HYDRASEO',
      icon: Sparkles,
      features: [
        '5 articles/month',
        'Basic SEO optimization',
        'Email support',
        'Basic analytics',
      ],
      cta: 'Current Plan',
      highlighted: false,
      disabled: true,
    },
    {
      name: 'Solo',
      price: '$9',
      period: '/month',
      description: 'Great for individual bloggers',
      icon: Zap,
      features: [
        '40 articles/month',
        'All SEO features',
        'AI Image generation',
        'WordPress integration',
        'Priority support',
      ],
      cta: 'Upgrade to Solo',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$49',
      period: '/month',
      description: 'For power users and professionals',
      icon: Users,
      features: [
        '300 articles/month',
        'All features included',
        'Bulk generation (100+ articles)',
        'Amazon integration',
        'API access',
        'Advanced analytics',
      ],
      cta: 'Upgrade to Pro',
      highlighted: true,
    },
    {
      name: 'Agency',
      price: '$99',
      period: '/month',
      description: 'For teams and agencies',
      icon: Building2,
      features: [
        '800 articles/month',
        'Everything in Pro',
        'Team collaboration',
        'White-label options',
        'Dedicated support',
        'Custom workflows',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Upgrade Your Plan</h1>
          <p className="text-gray-400">Choose the plan that fits your content needs</p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-[#1a1a1a] border-gray-800 ${
                plan.highlighted ? 'border-purple-500 ring-1 ring-purple-500' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                  <plan.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>

                <Button
                  className={`w-full mb-6 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white'
                      : plan.disabled
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                  disabled={plan.disabled}
                >
                  {plan.cta}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-400 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Unlimited Plan */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Need Unlimited?</h3>
            <p className="text-gray-400 mb-4">
              Get unlimited articles, priority AI processing, and a dedicated account manager.
            </p>
            <div className="mb-6">
              <span className="text-5xl font-bold text-white">$199</span>
              <span className="text-gray-400">/month</span>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-8">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PricingPage;
