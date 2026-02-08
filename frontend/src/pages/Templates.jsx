import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { templatesApi } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2, FileText, Star, ArrowRight, Filter } from 'lucide-react';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      const [templatesData, categoriesData] = await Promise.all([
        templatesApi.getAll(selectedCategory || undefined),
        templatesApi.getCategories()
      ]);
      setTemplates(templatesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = (templateId) => {
    navigate(`/articles/new?template=${templateId}`);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Blog Posts': 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      'Reviews': 'bg-green-500/20 text-green-400 border-green-500/50',
      'E-commerce': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      'SaaS': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
      'News': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      'Email': 'bg-pink-500/20 text-pink-400 border-pink-500/50',
      'Social Media': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      'Technical': 'bg-red-500/20 text-red-400 border-red-500/50',
      'SEO': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Templates Library</h1>
          <p className="text-gray-400">100+ pre-built templates for every content type</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('')}
            className={selectedCategory === '' ? 'bg-purple-500' : 'border-gray-700 text-gray-300'}
            size="sm"
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'bg-purple-500' : 'border-gray-700 text-gray-300'}
              size="sm"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="bg-[#1a1a1a] border-gray-800 hover:border-purple-500/50 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-400" />
                  </div>
                  {template.is_premium && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                      <Star className="w-3 h-3" /> Pro
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{template.name}</h3>
                <span className={`inline-block px-2 py-0.5 text-xs rounded border ${getCategoryColor(template.category)}`}>
                  {template.category}
                </span>
                <p className="text-gray-500 text-sm mt-3 line-clamp-2">{template.description}</p>
                {template.structure?.sections && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-600 mb-2">Includes:</p>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {template.structure.sections.slice(0, 3).join(' • ')}
                    </p>
                  </div>
                )}
                <Button
                  onClick={() => handleUseTemplate(template.id)}
                  className="w-full mt-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/50 text-purple-400 hover:bg-purple-500 hover:text-white group-hover:from-purple-500 group-hover:to-cyan-500 group-hover:text-white transition-all"
                >
                  Use Template <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Templates;
