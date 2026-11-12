import React, { useState } from 'react';
import { Restaurant, Review } from '../types/index.ts';
import { Api } from '../services/api.ts';
import { Star, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurants: Restaurant[];
  preselectedRestaurantId?: string;
  onReviewSubmitted: (newReview: Review) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  restaurants,
  preselectedRestaurantId,
  onReviewSubmitted
}) => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(
    preselectedRestaurantId || restaurants[0]?.id || ''
  );
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCountry, setReviewerCountry] = useState('Italy');
  const [reviewerTier, setReviewerTier] = useState<string>('Senior Taster');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [ratingFood, setRatingFood] = useState(9.5);
  const [ratingCreativity, setRatingCreativity] = useState(9.2);
  const [ratingHospitality, setRatingHospitality] = useState(9.4);
  const [ratingWine, setRatingWine] = useState(9.0);
  const [dishesInput, setDishesInput] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const currentScore = (
    ratingFood * 0.4 +
    ratingCreativity * 0.25 +
    ratingHospitality * 0.2 +
    ratingWine * 0.15
  ).toFixed(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedRestaurantId) {
      setErrorMsg('Please select a restaurant to review.');
      return;
    }
    if (!reviewerName.trim()) {
      setErrorMsg('Please provide your name or reviewer alias.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 15) {
      setErrorMsg('Please provide a constructive review comment (at least 15 characters).');
      return;
    }

    const selectedRest = restaurants.find((r) => r.id === selectedRestaurantId);
    const parsedDishes = dishesInput
      .split(',')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    try {
      setIsSubmitting(true);
      const newReview = await Api.submitReview({
        restaurantId: selectedRestaurantId,
        restaurantName: selectedRest ? selectedRest.name : 'Fine Dining Restaurant',
        reviewerName: reviewerName.trim(),
        reviewerTier,
        reviewerCountry,
        visitDate,
        ratingFood: Number(ratingFood),
        ratingCreativity: Number(ratingCreativity),
        ratingHospitality: Number(ratingHospitality),
        ratingWine: Number(ratingWine),
        comment: comment.trim(),
        dishesOrdered: parsedDishes
      });

      setSuccessMsg('Thank you! Your verified dining review has been recorded by OAD.');
      onReviewSubmitted(newReview);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#faf8f5] w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-white border-b border-stone-200 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-semibold tracking-wider uppercase text-amber-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OAD Verified Dining Consensus</span>
            </div>
            <h3 className="text-2xl font-editorial font-normal text-stone-900 mt-0.5">
              Make a Review
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close review modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Restaurant Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Select Restaurant
            </label>
            <select
              value={selectedRestaurantId}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
              required
            >
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — {r.city}, {r.country} (#{r.rank} {r.category})
                </option>
              ))}
            </select>
          </div>

          {/* Reviewer Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Your Name / Alias
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Laurent C."
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Reviewer Tier
              </label>
              <select
                value={reviewerTier}
                onChange={(e) => setReviewerTier(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
              >
                <option value="Grand Connoisseur">Grand Connoisseur</option>
                <option value="Master Reviewer">Master Reviewer</option>
                <option value="Senior Taster">Senior Taster</option>
                <option value="Culinary Explorer">Culinary Explorer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Visit Date
              </label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
                required
              />
            </div>
          </div>

          {/* 4 OAD Rating Criteria Sliders */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                OAD Scoring Criteria (1.0 – 10.0)
              </span>
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-md">
                <span>Weighted Score:</span>
                <span className="text-amber-800 text-sm">{currentScore}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Food & Flavor */}
              <div>
                <div className="flex justify-between text-xs text-stone-600 mb-1">
                  <span>Food & Flavor (40%)</span>
                  <span className="font-mono font-semibold">{ratingFood}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="10"
                  step="0.1"
                  value={ratingFood}
                  onChange={(e) => setRatingFood(parseFloat(e.target.value))}
                  className="w-full accent-stone-900 cursor-pointer"
                />
              </div>

              {/* Creativity & Technique */}
              <div>
                <div className="flex justify-between text-xs text-stone-600 mb-1">
                  <span>Creativity & Technique (25%)</span>
                  <span className="font-mono font-semibold">{ratingCreativity}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="10"
                  step="0.1"
                  value={ratingCreativity}
                  onChange={(e) => setRatingCreativity(parseFloat(e.target.value))}
                  className="w-full accent-stone-900 cursor-pointer"
                />
              </div>

              {/* Hospitality & Service */}
              <div>
                <div className="flex justify-between text-xs text-stone-600 mb-1">
                  <span>Hospitality & Service (20%)</span>
                  <span className="font-mono font-semibold">{ratingHospitality}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="10"
                  step="0.1"
                  value={ratingHospitality}
                  onChange={(e) => setRatingHospitality(parseFloat(e.target.value))}
                  className="w-full accent-stone-900 cursor-pointer"
                />
              </div>

              {/* Wine & Beverage Pairing */}
              <div>
                <div className="flex justify-between text-xs text-stone-600 mb-1">
                  <span>Wine & Cellar (15%)</span>
                  <span className="font-mono font-semibold">{ratingWine}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="10"
                  step="0.1"
                  value={ratingWine}
                  onChange={(e) => setRatingWine(parseFloat(e.target.value))}
                  className="w-full accent-stone-900 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Dishes Sampled */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Highlight Dishes Sampled (comma separated)
            </label>
            <input
              type="text"
              value={dishesInput}
              onChange={(e) => setDishesInput(e.target.value)}
              placeholder="e.g. Cantabrian Mullet, Marinated Egg Yolk, Smoked Turbot"
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>

          {/* Detailed Review Comment */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Gastronomic Evaluation & Notes
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Detail your sensory experience, ingredient sourcing, technique precision, wine harmony, and overall dining atmosphere..."
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
              required
            />
          </div>

          {/* Modal Footer CTA */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-black hover:bg-stone-800 rounded-full shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting to OAD...' : 'Submit Verified Review'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
