import React from 'react';
import { ShowcaseCards } from './ShowcaseCards.tsx';
import { Sparkles, ArrowRight, Award } from 'lucide-react';

interface HeroProps {
  onSelectItem: (item: any) => void;
  onExploreClick: () => void;
  onOpenReviewModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectItem,
  onExploreClick,
  onOpenReviewModal
}) => {
  return (
    <section id="hero" className="relative w-full pt-6 pb-12 sm:pb-16 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Title Row */}
        <div className="pt-2 pb-6 sm:pb-8">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-normal tracking-tight text-stone-900 leading-[1.05] font-editorial">
            Opinionated About Dining
          </h1>
        </div>

        {/* Hero Visual Banner with Plated Dish and Editorial Quote */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-stone-200/80 bg-white mb-6 sm:mb-8">
          <div className="relative min-h-[360px] sm:min-h-[460px] lg:min-h-[500px] flex items-center">
            
            {/* Plated Culinary Dish matching reference image: Delicate carpaccio, herbs, micro-edible flowers */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=85"
                alt="Opinionated About Dining Haute Cuisine Plating"
                className="w-full h-full object-cover object-center transform scale-102 hover:scale-100 transition-transform duration-1000"
              />
              {/* Soft gradient wash to ensure text readability on the right side */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/90 lg:to-white/95" />
            </div>

            {/* Editorial Quote & Statement on the right */}
            <div className="relative ml-auto max-w-md lg:max-w-lg p-6 sm:p-10 lg:p-12 text-right">
              <div className="inline-flex items-center space-x-2 text-[11px] font-semibold tracking-widest uppercase text-stone-600 bg-stone-100/90 backdrop-blur-md px-3 py-1 rounded-full mb-3 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Global Gastronomy Consensus</span>
              </div>

              <p className="text-stone-900 text-base sm:text-lg lg:text-xl font-normal leading-relaxed text-right font-editorial italic">
                “OAD is where people reviews counts. With over 400.000 reviews by more then 10,000 people we are lovers of good cuisine.”
              </p>

              <div className="mt-5 flex items-center justify-end space-x-3 text-xs text-stone-600">
                <span className="font-semibold text-stone-900">Steve Plotnicki</span>
                <span>•</span>
                <span>OAD Founder & Global Curator</span>
              </div>

              <div className="mt-6 flex items-center justify-end space-x-3">
                <button
                  onClick={onOpenReviewModal}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-black hover:bg-stone-800 rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  Contribute Review
                </button>
                <button
                  onClick={onExploreClick}
                  className="px-4 py-2.5 text-xs font-medium text-stone-800 hover:text-black bg-stone-100/80 hover:bg-stone-200/80 rounded-full transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Explore 2024 List</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Curated Showcase Cards row */}
        <div className="mt-4">
          <ShowcaseCards onSelectItem={onSelectItem} />
        </div>

      </div>
    </section>
  );
};
