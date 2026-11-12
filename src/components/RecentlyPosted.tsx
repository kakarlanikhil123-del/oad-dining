import React from 'react';
import { ArrowUpRight, Clock, User } from 'lucide-react';
import { MagazineArticle } from '../types/index.ts';

interface RecentlyPostedProps {
  articles: MagazineArticle[];
  onSelectArticle: (article: MagazineArticle) => void;
  onExploreMagazine: () => void;
}

export const RecentlyPosted: React.FC<RecentlyPostedProps> = ({
  articles,
  onSelectArticle,
  onExploreMagazine
}) => {
  return (
    <section id="magazine" className="w-full py-14 sm:py-20 bg-[#faf8f5] border-t border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-200 mb-8">
          <h2 className="text-3xl sm:text-4xl font-editorial font-light tracking-tight text-stone-900">
            Recently Posted
          </h2>

          <button
            onClick={onExploreMagazine}
            className="inline-flex items-center space-x-1 text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer group"
          >
            <span>Explore our magazine</span>
            <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* 4 Visual Editorial Cards Grid matching the screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {articles.slice(0, 4).map((article) => (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group bg-white rounded-none border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Photo */}
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-xs">
                  {article.category}
                </div>
              </div>

              {/* Card Meta & Title */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-base font-editorial font-normal text-stone-900 group-hover:underline underline-offset-2 leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-light mt-1.5 line-clamp-2">
                    {article.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span className="truncate max-w-[110px]">{article.author}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
