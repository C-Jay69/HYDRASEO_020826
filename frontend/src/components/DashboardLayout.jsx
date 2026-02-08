import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  LayoutDashboard, FileText, Search, Target, Wand2,
  BookTemplate, Calendar, Settings, LogOut, Menu, X,
  Sun, Moon, Monitor, ChevronDown, CreditCard, Plus, User
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'Articles', href: '/articles' },
    { icon: Search, label: 'Keywords', href: '/keywords' },
    { icon: Target, label: 'Competitors', href: '/competitors' },
    { icon: Wand2, label: 'Rewrite', href: '/rewrite' },
    { icon: BookTemplate, label: 'Templates', href: '/templates' },
    { icon: Calendar, label: 'Calendar', href: '/calendar' },
  ];

  const themeOptions = [
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'auto', label: 'System', icon: Monitor },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-gray-800 px-4 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center">
          <img 
            src="https://customer-assets.emergentagent.com/job_seocopy-platform/artifacts/80n7a5ir_HYDRASEO_LOGO_TRANSPARENT_resized.jpg" 
            alt="HYDRASEO Logo" 
            className="h-8 w-auto object-contain"
          />
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-400 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0d0d0d] border-r border-gray-800 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 lg:h-20 flex items-center px-6 border-b border-gray-800">
            <Link to="/dashboard" className="flex items-center">
              <img 
                src="https://customer-assets.emergentagent.com/job_seocopy-platform/artifacts/80n7a5ir_HYDRASEO_LOGO_TRANSPARENT_resized.jpg" 
                alt="HYDRASEO Logo" 
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* New Article Button */}
          <div className="p-4">
            <Button
              onClick={() => navigate('/articles/new')}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> New Article
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Credits Display */}
          <div className="p-4 border-t border-gray-800">
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Credits</span>
                <span className="text-sm text-white font-medium">
                  {user?.credits_used || 0} / {user?.credits_limit || 5}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all"
                  style={{ width: `${((user?.credits_used || 0) / (user?.credits_limit || 5)) * 100}%` }}
                />
              </div>
              <Button
                variant="link"
                className="w-full mt-2 text-cyan-400 hover:text-cyan-300 p-0 h-auto"
                onClick={() => navigate('/pricing')}
              >
                Upgrade Plan
              </Button>
            </div>
          </div>

          {/* User Menu */}
          <div className="p-4 border-t border-gray-800">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <Avatar className="h-9 w-9 bg-gradient-to-br from-purple-500 to-cyan-500">
                    <AvatarFallback className="bg-transparent text-white text-sm">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-white font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#1a1a1a] border-gray-800">
                <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-gray-800">
                  <User className="w-4 h-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-gray-800">
                  <CreditCard className="w-4 h-4 mr-2" /> Billing
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-gray-800">
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <div className="p-2">
                  <p className="text-xs text-gray-500 mb-2 px-2">Theme</p>
                  <div className="flex gap-1">
                    {themeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setTheme(opt.value)}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded text-xs transition-colors ${
                          theme === opt.value
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        <opt.icon className="w-3 h-3" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
