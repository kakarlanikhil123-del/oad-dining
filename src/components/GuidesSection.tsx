import React, { useState } from 'react';
import { Guide } from '../types/index.ts';
import { ArrowUpRight } from 'lucide-react';

interface GuidesSectionProps {
  cityGuides: Guide[];
  countryGuides: Guide[];
  onSelectGuide: (guide: Guide) => void;
  onViewAllGuides: () => void;
}

export const GuidesSection: React.FC<GuidesSectionProps> = ({
  cityGuides,
  countryGuides,
  onSelectGuide,
  onViewAllGuides
}) => {
  const [activeTab, setActiveTab] = useState<'city' | 'country'>('city');

  const displayedGuides = activeTab === 'city' ? cityGuides : countryGuides;

  return (
    <section id="guides" className="w-full py-12 sm:py-16 bg-[#faf8f5] border-t border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tab Headers Row matching reference image */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-200 pb-4 mb-8">
          <div className="flex items-baseline space-x-8 sm:space-x-12">
            
            {/* City Guides Tab */}
            <button
              onClick={() => setActiveTab('city')}
              className="text-left group focus:outline-none cursor-pointer"
            >
              <span className="block text-xs font-light text-stone-400 mb-0.5 tracking-wider">
                16
              </span>
              <span
                className={`text-3xl sm:text-4xl font-editorial tracking-tight transition-colors ${
                  activeTab === 'city'
                    ? 'text-stone-900 border-b-2 border-stone-900 pb-1 font-normal'
                    : 'text-stone-400 hover:text-stone-600 font-light'
                }`}
              >
                City Guides
              </span>
            </button>

            {/* Country Guides Tab */}
            <button
              onClick={() => setActiveTab('country')}
              className="text-left group focus:outline-none cursor-pointer"
            >
              <span className="block text-xs font-light text-stone-400 mb-0.5 tracking-wider">
                4
              </span>
              <span
                className={`text-3xl sm:text-4xl font-editorial tracking-tight transition-colors ${
                  activeTab === 'country'
                    ? 'text-stone-900 border-b-2 border-stone-900 pb-1 font-normal'
                    : 'text-stone-400 hover:text-stone-600 font-light'
                }`}
              >
                Country Guides
              </span>
            </button>
          </div>

          {/* Right Link */}
          <div className="mt-4 sm:mt-0">
            <button
              onClick={onViewAllGuides}
              className="inline-flex items-center space-x-1 text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer group"
            >
              <span>View all our guides</span>
              <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {displayedGuides.slice(0, 8).map((guide) => (
            <div
              key={guide.id}
              onClick={() => onSelectGuide(guide)}
              className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-none overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
            >
              {/* Photo */}
              <img
                src={guide.image}
                alt={guide.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                loading="lazy"
              />

              {/* Dark Gradient Overlay for typography contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity group-hover:from-black/90" />

              {/* Top arrow pill on hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full p-1.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
              </div>

              {/* Bottom Text metadata */}
              <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end text-white">
                <h3 className="text-xl sm:text-2xl font-editorial font-normal tracking-wide text-white group-hover:underline underline-offset-4">
                  {guide.name}
                </h3>
                <p className="text-[11px] text-stone-300 font-light mt-0.5">
                  {guide.restaurantCount} restaurants
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
