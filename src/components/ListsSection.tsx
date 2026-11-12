import React, { useState } from 'react';
import { ArrowUpRight, ArrowRight, Star, ExternalLink } from 'lucide-react';
import { Restaurant } from '../types/index.ts';

interface ListCategory {
  id: string;
  title: string;
  count: number;
  previewDish: string;
  restaurants: Restaurant[];
}

interface ListsSectionProps {
  categories: ListCategory[];
  currentRegion: string;
  onSelectRegion: (region: string) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onViewAllLists: () => void;
}

export const ListsSection: React.FC<ListsSectionProps> = ({
  categories,
  currentRegion,
  onSelectRegion,
  onSelectRestaurant,
  onViewAllLists
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0]?.id || 'top-restaurants'
  );
  const [hoveredCategory, setHoveredCategory] = useState<ListCategory | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const activeCategory =
    hoveredCategory ||
    categories.find((c) => c.id === activeCategoryId) ||
    categories[0];

  const currentCategoryData = categories.find((c) => c.id === activeCategoryId) || categories[0];

  const handleCategoryClick = (category: ListCategory) => {
    setActiveCategoryId(category.id);
    setIsCategoryModalOpen(true);
  };

  return (
    <section id="lists" className="w-full py-14 sm:py-20 bg-white border-t border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200">
          <div>
            <h2 className="text-3xl sm:text-4xl font-editorial font-light tracking-tight text-stone-900">
              List 2024
            </h2>
            
            {/* Region Filter Pills */}
            <div className="flex items-center space-x-2 mt-4 text-xs">
              {['Europe', 'North America', 'Asia', 'Global'].map((region) => (
                <button
                  key={region}
                  onClick={() => onSelectRegion(region)}
                  className={`px-3 py-1 rounded-sm border transition-colors cursor-pointer ${
                    currentRegion === region
                      ? 'border-stone-900 bg-stone-900 text-white font-medium'
                      : 'border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Right Link */}
          <div className="mt-4 sm:mt-0">
            <button
              onClick={onViewAllLists}
              className="inline-flex items-center space-x-1 text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer group"
            >
              <span>View our lists</span>
              <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Content: List Items on Left, Floating Dish Preview on Right (matching screenshot) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[420px]">
          
          {/* Left: Interactive Category Rows */}
          <div className="lg:col-span-7 divide-y divide-stone-200/80">
            {categories.map((category) => {
              const isSelected = activeCategoryId === category.id;
              return (
                <div
                  key={category.id}
                  onMouseEnter={() => setHoveredCategory(category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  onClick={() => handleCategoryClick(category)}
                  className={`py-5 sm:py-6 flex items-center justify-between cursor-pointer group transition-all duration-200 px-2 rounded-sm ${
                    isSelected ? 'bg-stone-50/80' : 'hover:bg-stone-50/50'
                  }`}
                >
                  {/* Category Title */}
                  <span className="text-xl sm:text-2xl font-editorial font-light tracking-wide text-stone-900 group-hover:translate-x-1 transition-transform">
                    {category.title}
                  </span>

                  {/* Count & Arrow */}
                  <div className="flex items-center space-x-3 text-stone-600 group-hover:text-stone-900">
                    <span className="text-sm sm:text-base font-light tracking-wider font-mono">
                      {category.count}
                    </span>
                    <span className="text-lg font-light group-hover:translate-x-1.5 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Floating Dish Preview exactly matching the circular ceramic dish in the reference */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-center">
            {activeCategory && (
              <div
                onClick={() => handleCategoryClick(activeCategory)}
                className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-white group cursor-pointer transition-all duration-500 hover:shadow-2xl"
              >
                <img
                  src={activeCategory.previewDish}
                  alt={activeCategory.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-stone-300">
                    2024 Category Preview
                  </span>
                  <p className="text-lg font-editorial font-normal mt-0.5">
                    {activeCategory.title}
                  </p>
                  <p className="text-xs text-stone-300 font-light mt-1 flex items-center space-x-1">
                    <span>Click to explore all {activeCategory.count} establishments</span>
                    <ArrowRight className="w-3 h-3" />
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Category Full Rankings Modal */}
      {isCategoryModalOpen && currentCategoryData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#faf8f5] w-full max-w-4xl max-h-[88vh] rounded-xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 bg-white border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-stone-400">
                  OAD 2024 Rankings • {currentRegion}
                </span>
                <h3 className="text-2xl sm:text-3xl font-editorial font-normal text-stone-900 mt-1">
                  {currentCategoryData.title} ({currentCategoryData.count} Restaurants)
                </h3>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal List */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {currentCategoryData.restaurants.length > 0 ? (
                currentCategoryData.restaurants.map((rest) => (
                  <div
                    key={rest.id}
                    onClick={() => {
                      setIsCategoryModalOpen(false);
                      onSelectRestaurant(rest);
                    }}
                    className="p-4 bg-white rounded-lg border border-stone-200/80 hover:border-stone-400 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Rank badge */}
                      <span className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-900 text-white text-xs font-bold font-mono">
                        #{rest.rank}
                      </span>
                      <img
                        src={rest.dishImage || rest.image}
                        alt={rest.name}
                        className="w-14 h-14 rounded-md object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-base font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
                            {rest.name}
                          </h4>
                          {rest.stars > 0 && (
                            <span className="text-amber-500 text-xs tracking-widest font-bold">
                              {'★'.repeat(rest.stars)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500">
                          {rest.city}, {rest.country} • Chef {rest.chef}
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {rest.cuisine} • {rest.priceRange}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 sm:space-x-6 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-xs font-medium text-stone-400 block">OAD Score</span>
                        <span className="text-base font-bold text-stone-900 font-mono">
                          {rest.score}
                        </span>
                      </div>
                      <span className="text-stone-400 group-hover:text-stone-900 text-sm font-semibold">
                        View details →
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-stone-500">
                  <p>Curated ranking records are loading for this region.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-5 py-2 text-xs font-semibold text-stone-700 hover:text-stone-950 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
