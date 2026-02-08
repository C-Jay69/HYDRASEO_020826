import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Articles API
export const articlesApi = {
  getAll: async (params = {}) => {
    const response = await axios.get(`${API}/articles`, {
      params,
      headers: getAuthHeader()
    });
    return response.data;
  },
  
  getOne: async (id) => {
    const response = await axios.get(`${API}/articles/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  
  create: async (data) => {
    const response = await axios.post(`${API}/articles`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await axios.put(`${API}/articles/${id}`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  
  delete: async (id) => {
    await axios.delete(`${API}/articles/${id}`, {
      headers: getAuthHeader()
    });
  },
  
  export: async (id, format) => {
    const response = await axios.post(
      `${API}/articles/${id}/export?export_format=${format}`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  }
};

// AI Services API
export const aiApi = {
  generateKeywords: async (seedKeyword, count = 20) => {
    const response = await axios.post(`${API}/ai/keywords`, {
      seed_keyword: seedKeyword,
      count
    }, { headers: getAuthHeader() });
    return response.data;
  },
  
  analyzeCompetitors: async (keyword, count = 10) => {
    const response = await axios.post(`${API}/ai/competitors`, {
      keyword,
      count
    }, { headers: getAuthHeader() });
    return response.data;
  },
  
  analyzeSeo: async (content, targetKeyword) => {
    const response = await axios.post(`${API}/ai/seo-analysis`, {
      content,
      target_keyword: targetKeyword
    }, { headers: getAuthHeader() });
    return response.data;
  },
  
  rewriteContent: async (content, tone, humanize = false, preserveKeywords = []) => {
    const response = await axios.post(`${API}/ai/rewrite`, {
      content,
      tone,
      humanize,
      preserve_keywords: preserveKeywords
    }, { headers: getAuthHeader() });
    return response.data;
  },
  
  checkPlagiarism: async (content) => {
    const response = await axios.post(`${API}/ai/plagiarism-check`, content, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'text/plain'
      }
    });
    return response.data;
  }
};

// Templates API
export const templatesApi = {
  getAll: async (category = null) => {
    const response = await axios.get(`${API}/templates`, {
      params: category ? { category } : {},
      headers: getAuthHeader()
    });
    return response.data;
  },
  
  getCategories: async () => {
    const response = await axios.get(`${API}/templates/categories`, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  
  getOne: async (id) => {
    const response = await axios.get(`${API}/templates/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

// Analytics API
export const analyticsApi = {
  get: async () => {
    const response = await axios.get(`${API}/analytics`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

// Calendar API
export const calendarApi = {
  getEvents: async (startDate, endDate) => {
    const response = await axios.get(`${API}/calendar`, {
      params: { start_date: startDate, end_date: endDate },
      headers: getAuthHeader()
    });
    return response.data;
  },
  
  createEvent: async (data) => {
    const response = await axios.post(`${API}/calendar`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  
  deleteEvent: async (id) => {
    await axios.delete(`${API}/calendar/${id}`, {
      headers: getAuthHeader()
    });
  }
};

// Pricing API
export const pricingApi = {
  getPlans: async () => {
    const response = await axios.get(`${API}/pricing`);
    return response.data;
  }
};
