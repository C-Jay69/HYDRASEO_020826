import React, { useState } from 'react';
import { aiApi } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Search, Loader2, TrendingUp, Target, Hash, Star } from 'lucide-react';

const Keywords = () => {
  const [seedKeyword, setSeedKeyword] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!seedKeyword.trim()) return;

    setLoading(true);
    try {
      const result = await aiApi.generateKeywords(seedKeyword.trim(), 20);
      setKeywords(result.keywords);
    } catch (error) {
      console.error('Failed to generate keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty < 30) return 'text-green-400';
    if (difficulty < 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Keyword Research</h1>
          <p className="text-gray-400">Discover high-value keywords for your content</p>
        </div>

        {/* Search */}
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  value={seedKeyword}
                  onChange={(e) => setSeedKeyword(e.target.value)}
                  placeholder="Enter a seed keyword (e.g., 'content marketing')"
                  className="pl-12 py-6 text-lg bg-[#2a2a2a] border-gray-700 text-white"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !seedKeyword.trim()}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-8"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {keywords.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Found {keywords.length} keywords</h2>
              <Button variant="outline" className="border-gray-700 text-gray-300">
                Export CSV
              </Button>
            </div>

            <div className="grid gap-3">
              {keywords.map((kw, index) => (
                <Card key={index} className="bg-[#1a1a1a] border-gray-800 hover:border-gray-700 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          {kw.is_long_tail ? <Hash className="w-5 h-5 text-purple-400" /> : <Target className="w-5 h-5 text-cyan-400" />}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{kw.keyword}</h3>
                          <p className="text-sm text-gray-500">
                            {kw.is_long_tail ? 'Long-tail keyword' : 'Primary keyword'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-gray-500">Volume</p>
                          <p className="text-white font-semibold">{kw.search_volume?.toLocaleString() || 'N/A'}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500">Difficulty</p>
                          <p className={`font-semibold ${getDifficultyColor(kw.difficulty)}`}>
                            {kw.difficulty || 'N/A'}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500">Relevance</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-white font-semibold">{(kw.relevance_score * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700 text-gray-300 hover:text-white"
                        >
                          Use Keyword
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!loading && keywords.length === 0 && (
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="py-16 text-center">
              <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Start Your Research</h3>
              <p className="text-gray-500">Enter a seed keyword above to discover related keywords</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Keywords;
