import React from 'react';
import { Restaurant } from '../types/index.ts';
import { X, Bookmark, ArrowRight, Trash2 } from 'lucide-react';

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedRestaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onRemoveSaved: (id: string) => void;
}

export const SavedModal: React.FC<SavedModalProps> = ({
  isOpen,
  onClose,
  savedRestaurants,
  onSelectRestaurant,
  onRemoveSaved
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#faf8f5] w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-stone-900 fill-stone-900" />
            <h3 className="text-2xl font-editorial font-normal text-stone-900">
              Saved Restaurants ({savedRestaurants.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {savedRestaurants.length === 0 ? (
            <div className="py-12 text-center text-stone-500">
              <Bookmark className="w-8 h-8 mx-auto text-stone-300 mb-2" />
              <p className="text-sm">You haven't bookmarked any restaurants yet.</p>
              <p className="text-xs text-stone-400 mt-1">
                Click the bookmark icon on any restaurant card or modal to curate your dining wishlist.
              </p>
            </div>
          ) : (
            savedRestaurants.map((rest) => (
              <div
                key={rest.id}
                className="p-3.5 bg-white rounded-xl border border-stone-200 flex items-center justify-between group hover:border-stone-400 transition-all"
              >
                <div
                  onClick={() => {
                    onClose();
                    onSelectRestaurant(rest);
                  }}
                  className="flex items-center space-x-3 cursor-pointer flex-1"
                >
                  <img
                    src={rest.dishImage || rest.image}
                    alt={rest.name}
                    className="w-12 h-12 rounded-lg object-cover"
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
                      {rest.city}, {rest.country} • OAD Score {rest.score}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onRemoveSaved(rest.id)}
                    className="p-2 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onSelectRestaurant(rest);
                    }}
                    className="p-2 text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-stone-700 hover:text-stone-950 cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
