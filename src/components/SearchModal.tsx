import React, { useState, useEffect } from 'react';
import { Api } from '../services/api.ts';
import { Restaurant, Guide } from '../types/index.ts';
import { Search, X, MapPin, ArrowRight, BookOpen, Utensils } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onSelectGuide: (guide: Guide) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectRestaurant,
  onSelectGuide
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    restaurants: Restaurant[];
    guides: Guide[];
    articles: any[];
  }>({ restaurants: [], guides: [], articles: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ restaurants: [], guides: [], articles: [] });
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      Api.search(query)
        .then((data) => setResults(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    results.restaurants.length + results.guides.length + results.articles.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#faf8f5] w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Header Input */}
        <div className="p-4 bg-white border-b border-stone-200 flex items-center space-x-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants, chefs, cities, or culinary guides (e.g. Alchemist, Roma, Cracco)..."
            className="w-full text-base sm:text-lg text-stone-900 placeholder:text-stone-400 bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 rounded-md cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Quick Suggestion Pills when empty */}
        {!query.trim() && (
          <div className="p-6 text-center">
            <p className="text-xs font-semibold tracking-wider uppercase text-stone-400 mb-3">
              Popular Gastronomy Searches
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Desde 1911', 'Alchemist', 'Roma', 'Barcellona', 'Santorini', 'Nick Honey', 'Disfrutar'].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1 bg-white border border-stone-200 hover:border-stone-400 rounded-full text-xs text-stone-700 transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Results Container */}
        {query.trim() && (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {loading ? (
              <div className="text-center py-8 text-xs text-stone-400">
                Searching OAD database...
              </div>
            ) : totalResults === 0 ? (
              <div className="text-center py-8 text-sm text-stone-500">
                No culinary matches found for “{query}”. Try searching for cities like Roma or Paris.
              </div>
            ) : (
              <>
                {/* Restaurants */}
                {results.restaurants.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                      Restaurants ({results.restaurants.length})
                    </h4>
                    <div className="space-y-2">
                      {results.restaurants.map((rest) => (
                        <div
                          key={rest.id}
                          onClick={() => {
                            onClose();
                            onSelectRestaurant(rest);
                          }}
                          className="p-3 bg-white hover:bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={rest.dishImage || rest.image}
                              alt={rest.name}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                            <div>
                              <p className="text-sm font-semibold text-stone-900">{rest.name}</p>
                              <p className="text-xs text-stone-500">
                                {rest.city}, {rest.country} • Chef {rest.chef}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-xs font-mono font-bold text-stone-900">
                              OAD {rest.score}
                            </span>
                            <ArrowRight className="w-4 h-4 text-stone-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Guides */}
                {results.guides.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                      Dining Guides ({results.guides.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.guides.map((guide) => (
                        <div
                          key={guide.id}
                          onClick={() => {
                            onClose();
                            onSelectGuide(guide);
                          }}
                          className="p-3 bg-white hover:bg-stone-50 rounded-lg border border-stone-200 flex items-center space-x-3 cursor-pointer transition-colors"
                        >
                          <img
                            src={guide.image}
                            alt={guide.name}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                          <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-stone-900 truncate">
                              {guide.name} Guide
                            </p>
                            <p className="text-xs text-stone-500">
                              {guide.restaurantCount} rated restaurants
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Articles */}
                {results.articles.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                      Articles & Stories ({results.articles.length})
                    </h4>
                    <div className="space-y-2">
                      {results.articles.map((art) => (
                        <div
                          key={art.id}
                          className="p-3 bg-white hover:bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <p className="text-sm font-semibold text-stone-900">{art.title}</p>
                            <p className="text-xs text-stone-500">{art.readTime || '3 min read'}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-stone-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
