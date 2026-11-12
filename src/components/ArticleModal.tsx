import React from 'react';
import { BestOfArticle, MagazineArticle } from '../types/index.ts';
import { X, Clock, Calendar, User, Share2 } from 'lucide-react';

interface ArticleModalProps {
  article: (BestOfArticle | MagazineArticle) | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#faf8f5] w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        
        {/* Hero Photo */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-900 shrink-0">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on Hero */}
          <div className="absolute bottom-5 inset-x-6 text-white">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-widest rounded-full">
              {'category' in article ? article.category : 'OAD Editorial'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-editorial font-normal tracking-wide mt-2">
              {article.title}
            </h2>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-stone-800">
          <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-200 pb-4">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5" />
                <span className="font-medium text-stone-900">{article.author}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.date}</span>
              </span>
            </div>
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </span>
          </div>

          {'excerpt' in article && article.excerpt && (
            <p className="text-base sm:text-lg font-editorial italic text-stone-700 leading-relaxed border-l-2 border-stone-900 pl-4 py-1">
              {article.excerpt}
            </p>
          )}

          <div className="prose prose-stone text-sm sm:text-base leading-relaxed font-light space-y-4">
            <p>{article.content}</p>
            <p>
              Dining with discernment requires an understanding of ingredient origins, artisanal technique, and the human story behind every plate. OAD contributors evaluate meals not merely on luxury garnishes, but on purity of concept, flawless execution, and emotional resonance.
            </p>
            <p>
              Whether at a three-star cathedral of gastronomy or an unpretentious 8-seat seaside counter, culinary brilliance speaks through harmony, acidity, texture, and uncompromising dedication to quality.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-400">
            Opinionated About Dining Editorial Desk
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
