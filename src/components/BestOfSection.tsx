import React from 'react';
import { BestOfArticle } from '../types/index.ts';
import { ArrowUpRight, Clock, BookOpen } from 'lucide-react';

interface BestOfSectionProps {
  articles: BestOfArticle[];
  onSelectArticle: (article: BestOfArticle) => void;
}

export const BestOfSection: React.FC<BestOfSectionProps> = ({
  articles,
  onSelectArticle
}) => {
  return (
    <section id="best-of" className="w-full py-16 sm:py-20 bg-[#171311] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title: OAD Best Of */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-editorial font-light tracking-wide text-stone-100">
            OAD Best Of
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 font-light mt-2 max-w-xl mx-auto tracking-wide">
            Curated culinary insights, regional food deep-dives, and celebrated chef spotlights.
          </p>
        </div>

        {/* 3 Featured Luxury Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((article) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group relative h-[440px] sm:h-[480px] rounded-none overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* Card Photo (Upper half and full background) */}
              <div className="absolute inset-0">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                  loading="lazy"
                />
              </div>

              {/* Lower Half Frosted Blur Gradient matching the screenshot */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/80 to-transparent backdrop-blur-[6px] transition-all group-hover:from-black" />

              {/* Top Right Click Icon */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>

              {/* Floating Badges & Content aligned in the lower blurred half */}
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center text-center justify-end">
                
                {/* Pill Badges: 'Best Of' + '[Category]' */}
                <div className="inline-flex items-center rounded-sm overflow-hidden mb-3 border border-stone-600/40 text-[11px] font-sans">
                  <span className="px-2.5 py-1 bg-black/60 text-stone-300 font-light tracking-wider">
                    Best Of
                  </span>
                  <span className="px-2.5 py-1 bg-white text-stone-900 font-medium tracking-wide">
                    {article.category}
                  </span>
                </div>

                {/* Article Title */}
                <h3 className="text-lg sm:text-xl font-editorial font-normal tracking-wide text-white group-hover:text-stone-100 transition-colors leading-snug max-w-xs">
                  {article.title}
                </h3>

                {/* Reading Time */}
                <div className="flex items-center space-x-1.5 text-[11px] text-stone-400 font-light mt-2">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
