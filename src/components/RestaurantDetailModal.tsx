import React, { useEffect, useState } from 'react';
import { Restaurant, Review } from '../types/index.ts';
import { Api } from '../services/api.ts';
import {
  X,
  Bookmark,
  ExternalLink,
  MapPin,
  Phone,
  ChefHat,
  Star,
  Award,
  Sparkles,
  Calendar,
  Utensils
} from 'lucide-react';

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null;
  onClose: () => void;
  onOpenReviewForRestaurant: (restaurant: Restaurant) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({
  restaurant,
  onClose,
  onOpenReviewForRestaurant,
  isSaved,
  onToggleSave
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setLoadingReviews(true);
      Api.getReviews(restaurant.id)
        .then((res) => setReviews(res))
        .catch((err) => console.error(err))
        .finally(() => setLoadingReviews(false));
    }
  }, [restaurant]);

  if (!restaurant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#faf8f5] w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-900 shrink-0">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Top Controls */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-mono font-bold rounded-full">
                #{restaurant.rank} {restaurant.category}
              </span>
              <span className="px-3 py-1 bg-amber-500/90 backdrop-blur-md text-stone-950 text-xs font-bold rounded-full">
                OAD Score: {restaurant.score}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleSave(restaurant.id)}
                className={`p-2.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                  isSaved ? 'bg-amber-500 text-stone-950' : 'bg-black/50 text-white hover:bg-black/80'
                }`}
                title={isSaved ? 'Saved in collection' : 'Save restaurant'}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-5 inset-x-6 text-white">
            <div className="flex items-baseline space-x-3">
              <h2 className="text-3xl sm:text-4xl font-editorial font-normal tracking-wide">
                {restaurant.name}
              </h2>
              {restaurant.stars > 0 && (
                <span className="text-amber-400 text-sm tracking-widest font-bold">
                  {'★'.repeat(restaurant.stars)}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-stone-300 font-light mt-1">
              {restaurant.city}, {restaurant.country} • {restaurant.cuisine} • {restaurant.priceRange}
            </p>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
              <div className="flex items-center space-x-2 text-stone-500 text-xs font-medium uppercase tracking-wider mb-1">
                <ChefHat className="w-4 h-4 text-stone-800" />
                <span>Head Chef</span>
              </div>
              <p className="text-sm font-semibold text-stone-900">{restaurant.chef}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
              <div className="flex items-center space-x-2 text-stone-500 text-xs font-medium uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4 text-stone-800" />
                <span>Location</span>
              </div>
              <p className="text-xs font-normal text-stone-700 truncate">{restaurant.address}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs">
              <div className="flex items-center space-x-2 text-stone-500 text-xs font-medium uppercase tracking-wider mb-1">
                <ExternalLink className="w-4 h-4 text-stone-800" />
                <span>Reservations</span>
              </div>
              <a
                href={restaurant.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-stone-900 hover:underline flex items-center space-x-1"
              >
                <span>Official Booking Site</span>
              </a>
            </div>
          </div>

          {/* Editorial Philosophy */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
              OAD Culinary Appraisal
            </h4>
            <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-light">
              {restaurant.description}
            </p>
          </div>

          {/* Highlight Signature Dish */}
          {restaurant.highlightDish && (
            <div className="bg-stone-100/80 rounded-xl p-5 border border-stone-200 flex flex-col sm:flex-row items-center gap-5">
              <img
                src={restaurant.dishImage || restaurant.image}
                alt={restaurant.highlightDish}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover shadow-sm shrink-0"
              />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-900 bg-amber-100 px-2 py-0.5 rounded-sm">
                  Signature Dish
                </span>
                <h5 className="text-base font-editorial font-normal text-stone-900 mt-1">
                  {restaurant.highlightDish}
                </h5>
                <p className="text-xs text-stone-500 font-light mt-1">
                  Voted by verified OAD community members as an essential culinary course.
                </p>
              </div>
            </div>
          )}

          {/* Community Reviews Section */}
          <div className="border-t border-stone-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-editorial font-normal text-stone-900">
                  Verified Reviews ({reviews.length})
                </h4>
                <p className="text-xs text-stone-500">
                  Independent ratings from vetted global dining connoisseurs.
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenReviewForRestaurant(restaurant);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-black hover:bg-stone-800 rounded-full transition-all shadow-xs cursor-pointer"
              >
                + Add Your Review
              </button>
            </div>

            {loadingReviews ? (
              <div className="py-8 text-center text-xs text-stone-400">
                Loading verified reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="py-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 text-xs">
                No reviews recorded yet for this season. Be the first to add your rating!
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 bg-white rounded-xl border border-stone-200/90 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
                          {rev.reviewerName[0]}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-900">{rev.reviewerName}</p>
                          <p className="text-[11px] text-stone-500">
                            {rev.reviewerTier} • {rev.reviewerCountry}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-stone-400 font-mono">
                          {rev.visitDate}
                        </span>
                        <div className="px-2.5 py-1 bg-stone-900 text-white rounded-md text-xs font-mono font-bold">
                          {rev.overallScore}
                        </div>
                      </div>
                    </div>

                    {/* Criteria badges */}
                    <div className="flex flex-wrap gap-2 text-[10px] text-stone-600">
                      <span className="bg-stone-100 px-2 py-0.5 rounded-sm">
                        Food: <strong>{rev.ratingFood}</strong>
                      </span>
                      <span className="bg-stone-100 px-2 py-0.5 rounded-sm">
                        Creativity: <strong>{rev.ratingCreativity}</strong>
                      </span>
                      <span className="bg-stone-100 px-2 py-0.5 rounded-sm">
                        Hospitality: <strong>{rev.ratingHospitality}</strong>
                      </span>
                      <span className="bg-stone-100 px-2 py-0.5 rounded-sm">
                        Wine: <strong>{rev.ratingWine}</strong>
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
                      “{rev.comment}”
                    </p>

                    {rev.dishesOrdered && rev.dishesOrdered.length > 0 && (
                      <div className="text-[11px] text-stone-500 flex items-center space-x-1.5 pt-1">
                        <Utensils className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>Dishes evaluated: {rev.dishesOrdered.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Opinionated About Dining Algorithm v2024
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
