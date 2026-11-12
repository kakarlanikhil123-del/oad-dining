import React, { useEffect, useState } from 'react';
import { Guide, Restaurant } from '../types/index.ts';
import { Api } from '../services/api.ts';
import { X, MapPin, Utensils, Star, ArrowRight } from 'lucide-react';

interface GuideDetailModalProps {
  guide: Guide | null;
  onClose: () => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onOpenReviewForCity: (guide: Guide) => void;
}

export const GuideDetailModal: React.FC<GuideDetailModalProps> = ({
  guide,
  onClose,
  onSelectRestaurant,
  onOpenReviewForCity
}) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (guide) {
      setLoading(true);
      Api.getGuideById(guide.id)
        .then((data) => setRestaurants(data.restaurants || []))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [guide]);

  if (!guide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#faf8f5] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        
        {/* Banner */}
        <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-stone-900 shrink-0">
          <img
            src={guide.image}
            alt={guide.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Badge */}
          <div className="absolute bottom-5 inset-x-6 text-white">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold uppercase tracking-widest rounded-full">
              {guide.type === 'city' ? 'City Dining Guide' : 'Country Dining Guide'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-editorial font-normal tracking-wide mt-2">
              {guide.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light mt-1">
              {guide.restaurantCount} rated dining establishments • Featured: {guide.featuredRestaurant}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
              Gastronomic Overview
            </h4>
            <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-light">
              {guide.description}
            </p>
          </div>

          {/* Cuisines Tags */}
          {guide.topCuisines && guide.topCuisines.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
                Defining Cuisines & Flavors
              </h4>
              <div className="flex flex-wrap gap-2">
                {guide.topCuisines.map((c) => (
                  <span
                    key={c}
                    className="px-3 py-1 bg-white border border-stone-200 text-stone-800 text-xs rounded-full font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rated Restaurants List */}
          <div className="border-t border-stone-200 pt-6">
            <h4 className="text-lg font-editorial font-normal text-stone-900 mb-4">
              Featured Top Restaurants in {guide.name}
            </h4>

            {loading ? (
              <div className="py-8 text-center text-xs text-stone-400">
                Loading guide establishments...
              </div>
            ) : restaurants.length === 0 ? (
              <div className="p-6 bg-white rounded-xl border border-stone-200 text-stone-500 text-xs text-center">
                Detailed individual index cards are currently being synchronized for {guide.name}.
              </div>
            ) : (
              <div className="space-y-3">
                {restaurants.map((rest) => (
                  <div
                    key={rest.id}
                    onClick={() => {
                      onClose();
                      onSelectRestaurant(rest);
                    }}
                    className="p-4 bg-white rounded-lg border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={rest.dishImage || rest.image}
                        alt={rest.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-semibold text-stone-900 group-hover:underline">
                            {rest.name}
                          </p>
                          {rest.stars > 0 && (
                            <span className="text-amber-500 text-xs">
                              {'★'.repeat(rest.stars)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500">
                          {rest.cuisine} • Chef {rest.chef}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-xs font-mono font-bold text-stone-900">
                        OAD {rest.score}
                      </span>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex justify-end">
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
