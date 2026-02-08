import React, { useState } from 'react';
import { aiApi } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Wand2, Loader2, Copy, RotateCcw, Check, Sparkles } from 'lucide-react';

const Rewrite = () => {
  const [content, setContent] = useState('');
  const [tone, setTone] = useState('professional');
  const [humanize, setHumanize] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const tones = [
    { id: 'professional', label: 'Professional' },
    { id: 'casual', label: 'Casual' },
    { id: 'friendly', label: 'Friendly' },
    { id: 'fun', label: 'Fun' },
    { id: 'viral', label: 'Viral' },
  ];

  const handleRewrite = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await aiApi.rewriteContent(content.trim(), tone, humanize);
      setResult(res);
    } catch (error) {
      console.error('Failed to rewrite:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.rewritten_content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setResult(null);
    setContent('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Content Rewriter</h1>
          <p className="text-gray-400">Transform and humanize your content with AI</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Original Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your content here to rewrite it..."
                className="min-h-[300px] bg-[#2a2a2a] border-gray-700 text-white"
              />
              
              {/* Options */}
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-400 mb-2 block">Tone</Label>
                  <div className="flex flex-wrap gap-2">
                    {tones.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTone(t.id)}
                        className={`px-4 py-2 rounded-lg text-sm transition-all ${
                          tone === t.id
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Humanize Mode</h4>
                    <p className="text-sm text-gray-500">Make content sound more natural</p>
                  </div>
                  <Switch checked={humanize} onCheckedChange={setHumanize} />
                </div>
              </div>

              <Button
                onClick={handleRewrite}
                disabled={loading || !content.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Rewriting...</>
                ) : (
                  <><Wand2 className="w-4 h-4 mr-2" /> Rewrite Content</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Rewritten Content</CardTitle>
              {result && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="text-gray-400 hover:text-white"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-gray-400 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="min-h-[300px] p-4 bg-[#2a2a2a] rounded-lg border border-gray-700">
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {result.rewritten_content}
                    </p>
                  </div>
                  {result.changes_made && (
                    <div className="flex flex-wrap gap-2">
                      {result.changes_made.map((change, i) => (
                        <span key={i} className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded">
                          {change}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="min-h-[300px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                    <p>Rewritten content will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Rewrite;
