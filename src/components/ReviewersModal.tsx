import React, { useEffect, useState } from 'react';
import { Reviewer } from '../types/index.ts';
import { Api } from '../services/api.ts';
import { X, Award, Star, Compass, UserCheck } from 'lucide-react';

interface ReviewersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMakeReview: () => void;
}

export const ReviewersModal: React.FC<ReviewersModalProps> = ({
  isOpen,
  onClose,
  onOpenMakeReview
}) => {
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Api.getReviewers()
        .then((data) => setReviewers(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#faf8f5] w-full max-w-3xl max-h-[88vh] rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-stone-200 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-semibold tracking-wider uppercase text-amber-800">
              <UserCheck className="w-4 h-4" />
              <span>OAD Global Community</span>
            </div>
            <h3 className="text-2xl font-editorial font-normal text-stone-900 mt-0.5">
              Top Reviewers Leaderboard
            </h3>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              Independent food lovers shaping global culinary consensus with over 400,000 evaluations.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reviewers List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="py-8 text-center text-xs text-stone-400">Loading reviewers...</div>
          ) : (
            reviewers.map((rev, idx) => (
              <div
                key={rev.id}
                className="p-4 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <span className="w-7 h-7 rounded-full bg-stone-100 text-stone-700 text-xs font-bold font-mono flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-12 h-12 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-stone-900">{rev.name}</h4>
                      <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 text-[10px] rounded-full font-medium">
                        {rev.tier}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">{rev.country}</p>
                    <p className="text-xs text-stone-600 mt-1 font-light italic">
                      “{rev.bio}”
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100 text-right shrink-0">
                  <span className="text-sm font-bold font-mono text-stone-900">
                    {rev.reviewsCount} reviews
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {rev.starredVisited} starred spots
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenMakeReview();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-black hover:bg-stone-800 rounded-full cursor-pointer"
          >
            Join as Reviewer
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
