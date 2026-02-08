import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { Droplet, Globe, Palette, Sparkles, ArrowRight, Check, Play } from 'lucide-react';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [brandVoice, setBrandVoice] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const tones = [
    { id: 'professional', label: 'Professional', description: 'Authoritative and industry-focused' },
    { id: 'casual', label: 'Casual', description: 'Friendly and conversational' },
    { id: 'fun', label: 'Fun & Viral', description: 'Engaging with personality' },
  ];

  const handleComplete = async () => {
    try {
      await updateUser({
        website_url: websiteUrl,
        brand_voice: `${selectedTone}: ${brandVoice}`,
        onboarding_completed: true
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      navigate('/dashboard');
    }
  };

  const handleSkip = async () => {
    try {
      await updateUser({ onboarding_completed: true });
    } catch (e) {
      // Continue anyway
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Step {step} of {totalSteps}</span>
            <button onClick={handleSkip} className="text-sm text-gray-500 hover:text-white">
              Skip for now
            </button>
          </div>
          <Progress value={progress} className="h-2 bg-gray-800" />
        </div>

        {/* Step 1: Welcome Video */}
        {step === 1 && (
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
              <Play className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to HYDRASEO!</h2>
            <p className="text-gray-400 mb-6">Watch this 60-second intro to get started</p>
            
            {/* Video Placeholder */}
            <div className="aspect-video bg-gray-900 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800" 
                alt="Tutorial" 
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
              >
                Continue Setup <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Website URL */}
        {step === 2 && (
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
              <Globe className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">What's your website?</h2>
            <p className="text-gray-400 mb-6 text-center">
              We'll analyze your site to auto-configure your brand voice (optional)
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Website URL</Label>
                <Input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Brand Voice */}
        {step === 3 && (
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
              <Palette className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Define your brand voice</h2>
            <p className="text-gray-400 mb-6 text-center">
              Choose a default tone for your content
            </p>
            
            <div className="space-y-4">
              {/* Tone Selection */}
              <div className="grid gap-3">
                {tones.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedTone === tone.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 bg-[#2a2a2a] hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">{tone.label}</h4>
                        <p className="text-sm text-gray-500">{tone.description}</p>
                      </div>
                      {selectedTone === tone.id && (
                        <Check className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Brand Notes */}
              <div className="space-y-2">
                <Label className="text-gray-300">Additional brand notes (optional)</Label>
                <Input
                  value={brandVoice}
                  onChange={(e) => setBrandVoice(e.target.value)}
                  placeholder="e.g., We're a B2B SaaS company focused on developers..."
                  className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
                >
                  <Sparkles className="mr-2 w-4 h-4" />
                  Start Creating
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
