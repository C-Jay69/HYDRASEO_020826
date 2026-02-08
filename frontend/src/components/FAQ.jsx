import React from 'react';
import { faqData } from '../data/mock';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

const FAQ = () => {
  return (
    <section id="resources" className="py-20 lg:py-32 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-cyan-400 font-semibold mb-4 tracking-wider uppercase">FAQ</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Questions & </span>
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Answers
            </span>
          </h2>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-[#2a2a2a] border border-gray-800 rounded-xl px-6 data-[state=open]:border-purple-500/50 transition-colors"
            >
              <AccordionTrigger className="text-left text-white hover:text-cyan-400 hover:no-underline py-6 text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
