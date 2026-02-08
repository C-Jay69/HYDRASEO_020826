import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { analyticsApi, articlesApi } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import DashboardLayout from '../components/DashboardLayout';
import {
  FileText, Plus, TrendingUp, BarChart3, Clock, Sparkles,
  ArrowRight, Star, Zap, Target, Search, Loader2
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [analyticsData, articles] = await Promise.all([
        analyticsApi.get(),
        articlesApi.getAll({ limit: 5 })
      ]);
      setAnalytics(analyticsData);
      setRecentArticles(articles);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const creditsUsedPercent = user ? (user.credits_used / user.credits_limit) * 100 : 0;

  const quickActions = [
    { icon: FileText, label: 'New Article', href: '/articles/new', color: 'from-purple-500 to-cyan-500' },
    { icon: Search, label: 'Keyword Research', href: '/keywords', color: 'from-blue-500 to-purple-500' },
    { icon: Target, label: 'Competitor Analysis', href: '/competitors', color: 'from-cyan-500 to-blue-500' },
    { icon: Zap, label: 'Quick Rewrite', href: '/rewrite', color: 'from-pink-500 to-purple-500' },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'there'}! 
            </h1>
            <p className="text-gray-400 mt-1">Ready to create some amazing content?</p>
          </div>
          <Button
            onClick={() => navigate('/articles/new')}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
          >
            <Plus className="mr-2 w-4 h-4" /> New Article
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Card className="bg-[#1a1a1a] border-gray-800 hover:border-purple-500/50 transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} bg-opacity-20 flex items-center justify-center mb-3`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-gray-300">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Articles</p>
                  <p className="text-3xl font-bold text-white mt-1">{analytics?.total_articles || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Words Written</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {(analytics?.total_words || 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg SEO Score</p>
                  <p className="text-3xl font-bold text-white mt-1">{analytics?.avg_seo_score || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Published</p>
                  <p className="text-3xl font-bold text-white mt-1">{analytics?.published_articles || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credits & Recent Articles */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Credits Card */}
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Credits Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Used this month</span>
                    <span className="text-white">{user?.credits_used || 0} / {user?.credits_limit || 5}</span>
                  </div>
                  <Progress 
                    value={creditsUsedPercent} 
                    className="h-3 bg-gray-800"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {user?.credits_limit - user?.credits_used || 0} articles remaining
                </p>
                <Button
                  variant="outline"
                  className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  onClick={() => navigate('/pricing')}
                >
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Articles */}
          <Card className="lg:col-span-2 bg-[#1a1a1a] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Recent Articles
              </CardTitle>
              <Link to="/articles" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {recentArticles.length > 0 ? (
                <div className="space-y-3">
                  {recentArticles.map((article) => (
                    <Link
                      key={article.id}
                      to={`/articles/${article.id}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{article.title}</h4>
                        <p className="text-sm text-gray-500">
                          {article.word_count} words • SEO: {article.seo_score}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        article.status === 'published' ? 'bg-green-500/20 text-green-400' :
                        article.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {article.status}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">No articles yet</p>
                  <Button
                    className="mt-4 bg-gradient-to-r from-purple-500 to-cyan-500"
                    onClick={() => navigate('/articles/new')}
                  >
                    Create Your First Article
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
