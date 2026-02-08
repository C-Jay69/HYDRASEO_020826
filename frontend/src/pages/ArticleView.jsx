import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articlesApi, aiApi } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  ArrowLeft, Edit, Save, Download, Trash2, Loader2, CheckCircle2,
  AlertTriangle, RefreshCw, Copy, FileText, BarChart2, Eye
} from 'lucide-react';

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [seoAnalysis, setSeoAnalysis] = useState(null);
  const [analyzingSeo, setAnalyzingSeo] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      const data = await articlesApi.getOne(id);
      setArticle(data);
      setEditedContent(data.content);
    } catch (error) {
      console.error('Failed to load article:', error);
      navigate('/articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await articlesApi.update(id, { content: editedContent });
      setArticle(updated);
      setEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyzeSeo = async () => {
    setAnalyzingSeo(true);
    try {
      const result = await aiApi.analyzeSeo(
        article.content,
        article.keywords?.[0] || article.title
      );
      setSeoAnalysis(result);
    } catch (error) {
      console.error('Failed to analyze SEO:', error);
    } finally {
      setAnalyzingSeo(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const result = await articlesApi.export(id, format);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(article.content);
  };

  const handlePublish = async () => {
    try {
      const updated = await articlesApi.update(id, { status: 'published' });
      setArticle(updated);
    } catch (error) {
      console.error('Failed to publish:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await articlesApi.delete(id);
      navigate('/articles');
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (!article) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <p className="text-gray-400">Article not found</p>
          <Button onClick={() => navigate('/articles')} className="mt-4">
            Back to Articles
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/articles')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white">{article.title}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span>{article.word_count} words</span>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded-full ${
                  article.status === 'published' ? 'bg-green-500/20 text-green-400' :
                  article.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {article.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {article.status !== 'published' && (
              <Button
                onClick={handlePublish}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> Publish
              </Button>
            )}
            <Button variant="outline" onClick={handleCopy} className="border-gray-700 text-gray-300">
              <Copy className="w-4 h-4 mr-2" /> Copy
            </Button>
            <Button variant="outline" onClick={() => handleExport('markdown')} className="border-gray-700 text-gray-300">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button variant="ghost" onClick={handleDelete} className="text-red-400 hover:text-red-300">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="content" className="space-y-4">
          <TabsList className="bg-[#1a1a1a] border border-gray-800">
            <TabsTrigger value="content" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <FileText className="w-4 h-4 mr-2" /> Content
            </TabsTrigger>
            <TabsTrigger value="seo" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <BarChart2 className="w-4 h-4 mr-2" /> SEO Analysis
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <Eye className="w-4 h-4 mr-2" /> Preview
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Article Content</CardTitle>
                {editing ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditing(false);
                        setEditedContent(article.content);
                      }}
                      className="border-gray-700 text-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setEditing(true)} className="bg-purple-500 hover:bg-purple-600">
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {editing ? (
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[500px] bg-[#2a2a2a] border-gray-700 text-white font-mono text-sm"
                  />
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                      {article.content}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-[#1a1a1a] border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">SEO Score</CardTitle>
                  <Button
                    onClick={handleAnalyzeSeo}
                    disabled={analyzingSeo}
                    variant="outline"
                    className="border-gray-700 text-gray-300"
                  >
                    {analyzingSeo ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                    Analyze
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      {seoAnalysis?.score || article.seo_score || 0}
                    </div>
                    <p className="text-gray-500 mt-2">out of 100</p>
                    <Progress value={seoAnalysis?.score || article.seo_score || 0} className="h-3 mt-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1a1a1a] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Meta Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Meta Title</label>
                    <p className="text-white mt-1">{article.meta_title || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Meta Description</label>
                    <p className="text-gray-300 mt-1">{article.meta_description || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Keywords</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {article.keywords?.map((kw, i) => (
                        <span key={i} className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {seoAnalysis && (
                <Card className="lg:col-span-2 bg-[#1a1a1a] border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {seoAnalysis.suggestions?.map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview">
            <Card className="bg-white text-black">
              <CardContent className="p-8">
                <article className="max-w-3xl mx-auto">
                  <h1 className="text-3xl font-bold mb-6">{article.title}</h1>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {article.content}
                    </div>
                  </div>
                </article>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ArticleView;
