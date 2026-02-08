import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articlesApi, templatesApi } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import {
  Sparkles, Loader2, ChevronRight, FileText, Wand2, Zap,
  Target, Languages, Hash, AlertCircle
} from 'lucide-react';

const NewArticle = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('professional');
  const [language, setLanguage] = useState('en');
  const [wordCount, setWordCount] = useState(1500);
  const [funMode, setFunMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await templatesApi.getAll();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const tones = [
    { id: 'professional', label: 'Professional', icon: Target },
    { id: 'casual', label: 'Casual', icon: FileText },
    { id: 'friendly', label: 'Friendly', icon: Sparkles },
    { id: 'authoritative', label: 'Authoritative', icon: Zap },
    { id: 'fun', label: 'Fun', icon: Wand2 },
    { id: 'viral', label: 'Viral', icon: Hash },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'it', name: 'Italian' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ko', name: 'Korean' },
  ];

  const handleGenerate = async () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const article = await articlesApi.create({
        title: title.trim(),
        keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
        tone,
        language,
        word_count_target: wordCount,
        template_id: selectedTemplate,
        include_images: false,
        fun_mode: funMode
      });
      
      navigate(`/articles/${article.id}`);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to generate article');
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Create New Article</h1>
          <p className="text-gray-400">Generate SEO-optimized content with AI</p>
        </div>

        {generating ? (
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Generating Your Article</h2>
              <p className="text-gray-400 mb-6">Our AI is crafting SEO-optimized content...</p>
              <div className="flex items-center justify-center gap-2 text-purple-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>This may take 30-60 seconds</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {/* Step 1: Basic Info */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-sm">1</span>
                  Article Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Article Title *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., How to Improve Your Website's SEO in 2025"
                    className="bg-[#2a2a2a] border-gray-700 text-white text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Target Keywords (comma separated)</Label>
                  <Textarea
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="seo tips, website optimization, google ranking"
                    className="bg-[#2a2a2a] border-gray-700 text-white min-h-[80px]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Languages className="w-4 h-4" /> Language
                    </Label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Target Word Count</Label>
                    <select
                      value={wordCount}
                      onChange={(e) => setWordCount(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white"
                    >
                      <option value={800}>Short (~800 words)</option>
                      <option value={1500}>Medium (~1500 words)</option>
                      <option value={2500}>Long (~2500 words)</option>
                      <option value={4000}>Extra Long (~4000 words)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Tone Selection */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-sm">2</span>
                  Writing Tone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {tones.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        tone === t.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 bg-[#2a2a2a] hover:border-gray-600'
                      }`}
                    >
                      <t.icon className={`w-5 h-5 mb-2 ${tone === t.id ? 'text-purple-400' : 'text-gray-500'}`} />
                      <span className={`text-sm font-medium ${tone === t.id ? 'text-white' : 'text-gray-400'}`}>
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-6 p-4 bg-[#2a2a2a] rounded-xl">
                  <div>
                    <h4 className="text-white font-medium">Fun Mode</h4>
                    <p className="text-sm text-gray-500">Add witty observations and engaging hooks</p>
                  </div>
                  <Switch checked={funMode} onCheckedChange={setFunMode} />
                </div>
              </CardContent>
            </Card>

            {/* Templates (Optional) */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm">3</span>
                  Template (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      !selectedTemplate
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 bg-[#2a2a2a] hover:border-gray-600'
                    }`}
                  >
                    <FileText className="w-5 h-5 mb-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-300">No Template</span>
                    <p className="text-xs text-gray-500 mt-1">Let AI decide the structure</p>
                  </button>
                  {templates.slice(0, 7).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedTemplate === template.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 bg-[#2a2a2a] hover:border-gray-600'
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-300">{template.name}</span>
                      <p className="text-xs text-gray-500 mt-1">{template.category}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/articles')}
                className="border-gray-700 text-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!title.trim()}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-8"
              >
                <Sparkles className="mr-2 w-4 h-4" />
                Generate Article
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NewArticle;
