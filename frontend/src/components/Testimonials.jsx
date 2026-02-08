import React, { useState, useEffect } from 'react';
import { testimonials } from '../data/mock';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Button } from './ui/button';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const itemsPerView = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 3 : 1;
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-black to-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-purple-400 font-semibold mb-4 tracking-wider uppercase">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">See the </span>
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              magic of writing
            </span>
            <span className="text-white"> come to life!</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            More than 50,000+ bloggers, entrepreneurs, and marketers use HYDRASEO
            to create content designed to rank on Google.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full lg:w-1/3 flex-shrink-0 px-3"
                >
                  <div className="bg-[#2a2a2a] rounded-2xl p-6 lg:p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col">
                    {/* Quote Icon */}
                    <div className="mb-4">
                      <Quote className="w-10 h-10 text-purple-500/40" />
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-gray-300 leading-relaxed flex-grow mb-6">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/50"
                      />
                      <div>
                        <h4 className="text-white font-semibold">{testimonial.name}</h4>
                        <p className="text-gray-500 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="border-gray-700 text-gray-400 hover:text-white hover:border-purple-500 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            {/* Dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.ceil(testimonials.length / itemsPerView) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index * itemsPerView > maxIndex ? maxIndex : index * itemsPerView);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    Math.floor(currentIndex / itemsPerView) === index
                      ? 'w-8 bg-gradient-to-r from-purple-500 to-cyan-500'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="border-gray-700 text-gray-400 hover:text-white hover:border-purple-500 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
