import React, { useState } from 'react';
import { aiApi } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Search, Loader2, Target, Globe, FileText, Lightbulb, ChevronRight } from 'lucide-react';

const Competitors = () => {
  const [keyword, setKeyword] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    try {
      const result = await aiApi.analyzeCompetitors(keyword.trim(), 5);
      setAnalysis(result);
    } catch (error) {
      console.error('Failed to analyze competitors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Competitor Analysis</h1>
          <p className="text-gray-400">Analyze top-ranking content and find opportunities</p>
        </div>

        {/* Search */}
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardContent className="p-6">
            <form onSubmit={handleAnalyze} className="flex gap-4">
              <div className="relative flex-1">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Enter a keyword to analyze (e.g., 'best SEO tools 2025')"
                  className="pl-12 py-6 text-lg bg-[#2a2a2a] border-gray-700 text-white"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !keyword.trim()}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-8"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {analysis && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* SERP Results */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold text-white">Top Ranking Content</h2>
              {analysis.results?.map((result, index) => (
                <Card key={index} className="bg-[#1a1a1a] border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-400 font-bold">#{result.rank}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">{result.title}</h3>
                        <p className="text-cyan-400 text-sm truncate">{result.url}</p>
                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{result.description}</p>
                        {result.word_count && (
                          <p className="text-gray-600 text-xs mt-2">{result.word_count} words</p>
                        )}
                        {result.headings?.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-1">Key Sections:</p>
                            <div className="flex flex-wrap gap-1">
                              {result.headings.slice(0, 4).map((h, i) => (
                                <span key={i} className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded">
                                  {h.replace('H2: ', '').replace('H3: ', '')}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Insights */}
            <div className="space-y-4">
              {/* Suggested Outline */}
              {analysis.suggested_outline?.length > 0 && (
                <Card className="bg-[#1a1a1a] border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-cyan-400" />
                      Suggested Outline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2">
                      {analysis.suggested_outline.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300">
                          <ChevronRight className="w-4 h-4 text-purple-400" />
                          {item}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )}

              {/* Content Gaps */}
              {analysis.content_gaps?.length > 0 && (
                <Card className="bg-[#1a1a1a] border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      Content Gaps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-3">Topics competitors might miss:</p>
                    <ul className="space-y-2">
                      {analysis.content_gaps.map((gap, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                          <span className="text-gray-300">{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {!loading && !analysis && (
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="py-16 text-center">
              <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Analyze Your Competition</h3>
              <p className="text-gray-500">Enter a keyword to see what top-ranking content includes</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Competitors;
