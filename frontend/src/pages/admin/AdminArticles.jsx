import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  FileText, Search, Loader2, MoreVertical, Trash2, Eye, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const limit = 20;

  useEffect(() => {
    loadArticles();
  }, [page, statusFilter]);

  const loadArticles = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${BACKEND_URL}/api/admin/articles`, {
        params: {
          skip: page * limit,
          limit,
          status: statusFilter || undefined,
          search: searchQuery || undefined
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(response.data.articles);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    loadArticles();
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${BACKEND_URL}/api/admin/articles/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadArticles();
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-yellow-500/20 text-yellow-400',
      published: 'bg-green-500/20 text-green-400',
      scheduled: 'bg-blue-500/20 text-blue-400',
      generating: 'bg-purple-500/20 text-purple-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Article Management</h1>
          <p className="text-gray-400">View and manage all generated articles</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title..."
                className="pl-10 bg-[#1a1a1a] border-gray-800 text-white"
              />
            </div>
            <Button type="submit" variant="outline" className="border-gray-700 text-gray-300">
              Search
            </Button>
          </form>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg text-gray-300"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="generating">Generating</option>
          </select>
        </div>

        {/* Articles Table */}
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Articles ({total})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Title</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Words</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">SEO</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article) => (
                      <tr key={article.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                        <td className="py-3 px-4">
                          <p className="text-white font-medium truncate max-w-xs">{article.title}</p>
                          <p className="text-gray-500 text-xs">User: {article.user_id.slice(0, 8)}...</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(article.status)}`}>
                            {article.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {article.word_count?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${
                            article.seo_score >= 80 ? 'text-green-400' :
                            article.seo_score >= 60 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {article.seo_score}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-sm">
                          {new Date(article.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#2a2a2a] border-gray-700">
                              <DropdownMenuItem className="text-gray-300 focus:text-white">
                                <Eye className="w-4 h-4 mr-2" /> View Article
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(article.id)}
                                className="text-red-400 focus:text-red-300"
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Article
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {articles.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No articles found</p>
                )}
              </div>
            )}

            {/* Pagination */}
            {total > limit && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                <p className="text-gray-500 text-sm">
                  Showing {page * limit + 1} - {Math.min((page + 1) * limit, total)} of {total}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="border-gray-700 text-gray-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={(page + 1) * limit >= total}
                    className="border-gray-700 text-gray-300"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminArticles;
