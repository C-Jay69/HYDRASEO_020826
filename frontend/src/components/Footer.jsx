import React from 'react';
import { footerLinks } from '../data/mock';
import { Droplet, Mail, Twitter, Linkedin, Youtube, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center mb-6 group">
              <img 
                src="https://customer-assets.emergentagent.com/job_seocopy-platform/artifacts/80n7a5ir_HYDRASEO_LOGO_TRANSPARENT_resized.jpg" 
                alt="HYDRASEO Logo" 
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </a>
            <p className="text-gray-500 text-sm mb-6">
              AI-powered SEO writing tool for creating optimized content that ranks on Google and AI search engines.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Youtube, href: '#' },
                { icon: Github, href: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:bg-gray-800 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Product</h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact</h4>
            <p className="text-gray-500 text-sm mb-4">
              If you need help using our service, or have a question about it, please feel free to contact us.
            </p>
            <a
              href="mailto:support@hydraseo.ai"
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Mail className="w-5 h-5" />
              support@hydraseo.ai
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} HYDRASEO. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
