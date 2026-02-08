import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { articlesApi } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import {
  Plus, Search, Filter, FileText, MoreVertical, Trash2, Edit, Eye,
  Download, Loader2, Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadArticles();
  }, [statusFilter]);

  const loadArticles = async () => {
    try {
      const data = await articlesApi.getAll({
        status: statusFilter || undefined,
        search: searchQuery || undefined
      });
      setArticles(data);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadArticles();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await articlesApi.delete(id);
      setArticles(articles.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  const handleExport = async (id, format) => {
    try {
      const result = await articlesApi.export(id, format);
      // Create download
      const blob = new Blob([result.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      a.click();
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400';
      case 'generating': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Articles</h1>
            <p className="text-gray-400">Manage your SEO-optimized content</p>
          </div>
          <Button
            onClick={() => navigate('/articles/new')}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
          >
            <Plus className="mr-2 w-4 h-4" /> New Article
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="pl-10 bg-[#1a1a1a] border-gray-800 text-white"
              />
            </div>
            <Button type="submit" variant="outline" className="border-gray-700 text-gray-300">
              Search
            </Button>
          </form>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg text-gray-300"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : articles.length > 0 ? (
          <div className="grid gap-4">
            {articles.map((article) => (
              <Card key={article.id} className="bg-[#1a1a1a] border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Link to={`/articles/${article.id}`}>
                        <h3 className="text-lg font-semibold text-white hover:text-cyan-400 transition-colors truncate">
                          {article.title}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                        <span>{article.word_count} words</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          SEO Score: <span className="text-white font-medium">{article.seo_score}</span>
                        </span>
                        <span>•</span>
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      </div>
                      {article.keywords?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {article.keywords.slice(0, 3).map((kw, i) => (
                            <span key={i} className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded">
                              {kw}
                            </span>
                          ))}
                          {article.keywords.length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-500">+{article.keywords.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(article.status)}`}>
                        {article.status}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#2a2a2a] border-gray-700">
                          <DropdownMenuItem 
                            onClick={() => navigate(`/articles/${article.id}`)}
                            className="text-gray-300 hover:text-white focus:text-white"
                          >
                            <Eye className="mr-2 w-4 h-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => navigate(`/articles/${article.id}/edit`)}
                            className="text-gray-300 hover:text-white focus:text-white"
                          >
                            <Edit className="mr-2 w-4 h-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleExport(article.id, 'markdown')}
                            className="text-gray-300 hover:text-white focus:text-white"
                          >
                            <Download className="mr-2 w-4 h-4" /> Export MD
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(article.id)}
                            className="text-red-400 hover:text-red-300 focus:text-red-300"
                          >
                            <Trash2 className="mr-2 w-4 h-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="py-16 text-center">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No articles yet</h3>
              <p className="text-gray-500 mb-6">Start creating SEO-optimized content with AI</p>
              <Button
                onClick={() => navigate('/articles/new')}
                className="bg-gradient-to-r from-purple-500 to-cyan-500"
              >
                <Plus className="mr-2 w-4 h-4" /> Create Your First Article
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Articles;
