import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { GuidesSection } from './components/GuidesSection.tsx';
import { BestOfSection } from './components/BestOfSection.tsx';
import { ListsSection } from './components/ListsSection.tsx';
import { RecentlyPosted } from './components/RecentlyPosted.tsx';
import { Footer } from './components/Footer.tsx';
import { ReviewModal } from './components/ReviewModal.tsx';
import { RestaurantDetailModal } from './components/RestaurantDetailModal.tsx';
import { GuideDetailModal } from './components/GuideDetailModal.tsx';
import { ArticleModal } from './components/ArticleModal.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { ReviewersModal } from './components/ReviewersModal.tsx';
import { SavedModal } from './components/SavedModal.tsx';
import { Api } from './services/api.ts';
import { Restaurant, Guide, BestOfArticle, MagazineArticle, Review } from './types/index.ts';

export default function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cityGuides, setCityGuides] = useState<Guide[]>([]);
  const [countryGuides, setCountryGuides] = useState<Guide[]>([]);
  const [bestOfArticles, setBestOfArticles] = useState<BestOfArticle[]>([]);
  const [magazineArticles, setMagazineArticles] = useState<MagazineArticle[]>([]);
  const [listCategories, setListCategories] = useState<any[]>([]);
  const [currentRegion, setCurrentRegion] = useState<string>('Europe');
  const [savedRestaurants, setSavedRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  // Modal states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [preselectedRestId, setPreselectedRestId] = useState<string | undefined>(undefined);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isReviewersModalOpen, setIsReviewersModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<(BestOfArticle | MagazineArticle) | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        restsData,
        cGuides,
        coGuides,
        bestData,
        magData,
        listsData,
        savedData
      ] = await Promise.all([
        Api.getRestaurants(),
        Api.getGuides('city'),
        Api.getGuides('country'),
        Api.getBestOfArticles(),
        Api.getMagazineArticles(),
        Api.getLists(currentRegion),
        Api.getSavedRestaurants()
      ]);

      setRestaurants(restsData);
      setCityGuides(cGuides);
      setCountryGuides(coGuides);
      setBestOfArticles(bestData);
      setMagazineArticles(magData);
      setListCategories(listsData.categories || []);
      setSavedRestaurants(savedData);
    } catch (err) {
      console.error('Failed to load OAD initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update lists when region changes
  const handleSelectRegion = async (region: string) => {
    setCurrentRegion(region);
    try {
      const listsData = await Api.getLists(region);
      setListCategories(listsData.categories || []);
    } catch (err) {
      console.error('Failed to fetch regional lists:', err);
    }
  };

  // Toggle save
  const handleToggleSave = async (id: string) => {
    try {
      const res = await Api.toggleSaveRestaurant(id);
      const updatedSaved = await Api.getSavedRestaurants();
      setSavedRestaurants(updatedSaved);
      showToast(res.isSaved ? 'Restaurant saved to wishlist' : 'Removed from wishlist');
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  };

  // Handle showcase item click
  const handleSelectShowcase = (item: any) => {
    if (item.type === 'restaurant' && item.targetId) {
      const rest = restaurants.find((r) => r.id === item.targetId);
      if (rest) setSelectedRestaurant(rest);
    } else if (item.type === 'city' && item.targetId) {
      const guide = cityGuides.find((g) => g.id === item.targetId);
      if (guide) setSelectedGuide(guide);
    } else if (item.type === 'region' && item.targetId) {
      const guide = countryGuides.find((g) => g.id === item.targetId);
      if (guide) setSelectedGuide(guide);
    } else if (item.type === 'chef') {
      const mag = magazineArticles.find((m) => m.id === 'mag-1');
      if (mag) setSelectedArticle(mag);
    }
  };

  const handleOpenReviewForRest = (rest: Restaurant) => {
    setPreselectedRestId(rest.id);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmitted = (newReview: Review) => {
    showToast(`Review for "${newReview.restaurantName}" published with overall score ${newReview.overallScore}!`);
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans flex flex-col selection:bg-stone-900 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-950 text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-medium flex items-center space-x-2 border border-stone-800 animate-in slide-in-from-bottom-5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        onOpenReviewModal={() => {
          setPreselectedRestId(undefined);
          setIsReviewModalOpen(true);
        }}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenReviewers={() => setIsReviewersModalOpen(true)}
        savedCount={savedRestaurants.length}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onSelectItem={handleSelectShowcase}
          onExploreClick={() => {
            const el = document.getElementById('lists');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenReviewModal={() => {
            setPreselectedRestId(undefined);
            setIsReviewModalOpen(true);
          }}
        />

        {/* City Guides & Country Guides Section */}
        <GuidesSection
          cityGuides={cityGuides}
          countryGuides={countryGuides}
          onSelectGuide={(g) => setSelectedGuide(g)}
          onViewAllGuides={() => {
            const el = document.getElementById('guides');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* OAD Best Of Section (Dark Theme) */}
        <BestOfSection
          articles={bestOfArticles}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />

        {/* List 2024 Rankings Section with Floating Dish Preview */}
        <ListsSection
          categories={listCategories}
          currentRegion={currentRegion}
          onSelectRegion={handleSelectRegion}
          onSelectRestaurant={(r) => setSelectedRestaurant(r)}
          onViewAllLists={() => {
            if (listCategories[0]) {
              setSelectedRestaurant(listCategories[0].restaurants?.[0] || restaurants[0]);
            }
          }}
        />

        {/* Recently Posted Magazine Section */}
        <RecentlyPosted
          articles={magazineArticles}
          onSelectArticle={(art) => setSelectedArticle(art)}
          onExploreMagazine={() => {
            if (magazineArticles[0]) setSelectedArticle(magazineArticles[0]);
          }}
        />
      </main>

      {/* Luxury OAD Editorial Footer */}
      <Footer />

      {/* Modals */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        restaurants={restaurants}
        preselectedRestaurantId={preselectedRestId}
        onReviewSubmitted={handleReviewSubmitted}
      />

      <RestaurantDetailModal
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        onOpenReviewForRestaurant={handleOpenReviewForRest}
        isSaved={selectedRestaurant ? savedRestaurants.some((r) => r.id === selectedRestaurant.id) : false}
        onToggleSave={handleToggleSave}
      />

      <GuideDetailModal
        guide={selectedGuide}
        onClose={() => setSelectedGuide(null)}
        onSelectRestaurant={(r) => setSelectedRestaurant(r)}
        onOpenReviewForCity={(g) => {
          setSelectedGuide(null);
          setIsReviewModalOpen(true);
        }}
      />

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectRestaurant={(r) => setSelectedRestaurant(r)}
        onSelectGuide={(g) => setSelectedGuide(g)}
      />

      <ReviewersModal
        isOpen={isReviewersModalOpen}
        onClose={() => setIsReviewersModalOpen(false)}
        onOpenMakeReview={() => setIsReviewModalOpen(true)}
      />

      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedRestaurants={savedRestaurants}
        onSelectRestaurant={(r) => setSelectedRestaurant(r)}
        onRemoveSaved={handleToggleSave}
      />
    </div>
  );
}
