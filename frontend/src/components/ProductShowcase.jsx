import React from 'react';
import { productShowcase } from '../data/mock';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const ProductShowcase = () => {
  return (
    <section className="py-20 lg:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-24 lg:space-y-32">
          {productShowcase.map((product, index) => (
            <div
              key={product.id}
              className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                index % 2 === 1 ? 'lg:direction-rtl' : ''
              }`}
            >
              {/* Text Content */}
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {product.title}
                  </span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  {product.description}
                </p>
                <Button
                  variant="link"
                  className="text-cyan-400 hover:text-cyan-300 text-lg p-0 group"
                >
                  {product.cta}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>

              {/* Image */}
              <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50 shadow-2xl shadow-purple-500/10 group">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Decorative Elements */}
                <div
                  className={`absolute -bottom-4 ${index % 2 === 0 ? '-right-4' : '-left-4'} w-24 h-24 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-2xl`}
                />
                <div
                  className={`absolute -top-4 ${index % 2 === 0 ? '-left-4' : '-right-4'} w-16 h-16 border border-cyan-500/30 rounded-lg transform rotate-12`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
