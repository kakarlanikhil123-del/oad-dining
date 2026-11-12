import React, { useState } from 'react';
import { Search, Bookmark, Menu, X, ArrowUpRight, ChefHat, Globe } from 'lucide-react';

interface NavbarProps {
  onOpenReviewModal: () => void;
  onOpenSearch: () => void;
  onOpenSaved: () => void;
  onOpenReviewers: () => void;
  savedCount: number;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReviewModal,
  onOpenSearch,
  onOpenSaved,
  onOpenReviewers,
  savedCount,
  activeSection,
  setActiveSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full bg-[#faf8f5]/90 backdrop-blur-md sticky top-0 z-40 border-b border-stone-200/60 transition-colors">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex justify-end items-center text-[12px] tracking-wide text-stone-500 border-b border-stone-200/40">
        <div className="flex items-center space-x-6">
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
            className="hover:text-stone-900 transition-colors"
          >
            Contact us
          </a>
          <a
            href="#about"
            onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
            className="hover:text-stone-900 transition-colors"
          >
            About
          </a>
          <a
            href="#help"
            onClick={(e) => { e.preventDefault(); scrollToSection('help'); }}
            className="hover:text-stone-900 transition-colors"
          >
            Help
          </a>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-1 hover:text-stone-900 focus:outline-none transition-colors cursor-pointer"
            >
              <span>{selectedLanguage}</span>
              <span className="text-[10px]">▾</span>
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-28 bg-white border border-stone-200 rounded-md shadow-lg py-1 z-50">
                {['English', 'Français', 'Italiano', 'Español', '日本語'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1 text-xs hover:bg-stone-50 transition-colors ${
                      selectedLanguage === lang ? 'font-semibold text-stone-900' : 'text-stone-600'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-10">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="group flex items-center space-x-2"
          >
            <span className="text-3xl font-extrabold tracking-tight font-sans text-stone-900 group-hover:opacity-85 transition-opacity">
              OAD
            </span>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-medium tracking-wider uppercase text-stone-700">
            <button
              onClick={() => scrollToSection('hero')}
              className={`hover:text-stone-950 transition-colors cursor-pointer ${
                activeSection === 'hero' ? 'text-stone-950 font-semibold' : ''
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => scrollToSection('guides')}
              className={`hover:text-stone-950 transition-colors cursor-pointer ${
                activeSection === 'guides' ? 'text-stone-950 font-semibold' : ''
              }`}
            >
              Dining Guides
            </button>
            <button
              onClick={onOpenReviewers}
              className="hover:text-stone-950 transition-colors cursor-pointer"
            >
              Top Reviewers
            </button>
            <button
              onClick={() => scrollToSection('best-of')}
              className={`hover:text-stone-950 transition-colors cursor-pointer ${
                activeSection === 'best-of' ? 'text-stone-950 font-semibold' : ''
              }`}
            >
              Travel with OAD
            </button>
            <button
              onClick={() => scrollToSection('magazine')}
              className={`hover:text-stone-950 transition-colors cursor-pointer ${
                activeSection === 'magazine' ? 'text-stone-950 font-semibold' : ''
              }`}
            >
              Magazine
            </button>
          </nav>
        </div>

        {/* Right CTA and controls */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer"
            title="Search restaurants, guides and articles"
            aria-label="Search"
          >
            <Search className="w-4 h-4 stroke-[2]" />
          </button>

          {/* Bookmarks / Saved */}
          <button
            onClick={onOpenSaved}
            className="relative p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer"
            title="Saved places"
            aria-label="Saved places"
          >
            <Bookmark className="w-4 h-4 stroke-[2]" />
            {savedCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-stone-900 text-white rounded-full text-[10px] font-semibold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Make a review Button (pill matching the reference image) */}
          <button
            onClick={onOpenReviewModal}
            className="hidden sm:inline-flex items-center justify-center px-4.5 py-2 text-xs font-medium tracking-wide text-white bg-black hover:bg-stone-800 rounded-full shadow-sm hover:shadow transition-all cursor-pointer"
          >
            Make a review
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-800 hover:bg-stone-100 rounded-md cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#faf8f5] border-b border-stone-200 px-6 py-5 space-y-4 shadow-lg animate-in fade-in duration-200">
          <div className="flex flex-col space-y-3 text-sm font-medium tracking-wider uppercase text-stone-800">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-left py-1 hover:text-black cursor-pointer"
            >
              Explore
            </button>
            <button
              onClick={() => scrollToSection('guides')}
              className="text-left py-1 hover:text-black cursor-pointer"
            >
              Dining Guides
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenReviewers(); }}
              className="text-left py-1 hover:text-black cursor-pointer"
            >
              Top Reviewers
            </button>
            <button
              onClick={() => scrollToSection('best-of')}
              className="text-left py-1 hover:text-black cursor-pointer"
            >
              Travel with OAD
            </button>
            <button
              onClick={() => scrollToSection('lists')}
              className="text-left py-1 hover:text-black cursor-pointer"
            >
              List 2024
            </button>
            <button
              onClick={() => scrollToSection('magazine')}
              className="text-left py-1 hover:text-black cursor-pointer"
            >
              Magazine
            </button>
          </div>

          <div className="pt-3 border-t border-stone-200 flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReviewModal();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-white bg-black rounded-full"
            >
              Make a review
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
