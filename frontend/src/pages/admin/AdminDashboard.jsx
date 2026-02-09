import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, FileText, TrendingUp, Clock, Loader2, BarChart3 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${BACKEND_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboard(response.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Overview of HYDRASEO platform statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-3xl font-bold text-white mt-1">{dashboard?.total_users || 0}</p>
                  <p className="text-xs text-green-400 mt-1">+{dashboard?.new_users_week || 0} this week</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Articles</p>
                  <p className="text-3xl font-bold text-white mt-1">{dashboard?.total_articles || 0}</p>
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
                  <p className="text-sm text-gray-400">Total Words</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {(dashboard?.total_words || 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Published</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {dashboard?.articles_by_status?.published || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users by Role & Articles by Status */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Users by Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(dashboard?.users_by_role || {}).map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between">
                    <span className="text-gray-400 capitalize">{role}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                          style={{ width: `${Math.min(100, (count / (dashboard?.total_users || 1)) * 100)}%` }}
                        />
                      </div>
                      <span className="text-white font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Articles by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(dashboard?.articles_by_status || {}).map(([status, count]) => {
                  const colors = {
                    draft: 'from-yellow-500 to-amber-500',
                    published: 'from-green-500 to-emerald-500',
                    scheduled: 'from-blue-500 to-indigo-500',
                    generating: 'from-purple-500 to-pink-500'
                  };
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-gray-400 capitalize">{status}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${colors[status] || 'from-gray-500 to-gray-600'} rounded-full`}
                            style={{ width: `${Math.min(100, (count / (dashboard?.total_articles || 1)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-white font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Recent Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboard?.recent_users?.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 capitalize">
                      {user.role}
                    </span>
                  </div>
                ))}
                {(!dashboard?.recent_users || dashboard.recent_users.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No users yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Recent Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboard?.recent_articles?.slice(0, 5).map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{article.title}</p>
                      <p className="text-gray-500 text-sm">{new Date(article.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      article.status === 'published' ? 'bg-green-500/20 text-green-400' :
                      article.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {article.status}
                    </span>
                  </div>
                ))}
                {(!dashboard?.recent_articles || dashboard.recent_articles.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No articles yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
