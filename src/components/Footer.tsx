import React, { useState } from 'react';
import { ArrowUpRight, Check, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#110e0c] text-white pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-editorial font-normal tracking-wide text-white">
              Opinionated About Dining
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed max-w-lg">
              The only dining survey powered by experienced global food connoisseurs. Our unique algorithm calculates restaurant rankings by weighting the dining experience and historical travel patterns of over 10,000 verified panelists.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-300 mb-2">
              Receive Curated OAD Dispatches
            </h4>
            <p className="text-xs text-stone-400 font-light mb-4">
              Weekly chef spotlights, newly rated restaurants, and upcoming regional survey releases.
            </p>
            {subscribed ? (
              <div className="p-3 bg-stone-800/80 border border-stone-700 rounded-lg text-emerald-400 text-xs flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>You are subscribed to the OAD culinary dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="px-4 py-2.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-stone-400 flex-1"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-white text-stone-950 font-semibold text-xs rounded-lg hover:bg-stone-200 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-10 border-b border-stone-800 text-xs">
          <div>
            <h5 className="font-semibold uppercase tracking-wider text-stone-300 mb-4">
              Rankings & Lists
            </h5>
            <ul className="space-y-2.5 text-stone-400 font-light">
              <li><a href="#lists" className="hover:text-white transition-colors">Top 100 Europe</a></li>
              <li><a href="#lists" className="hover:text-white transition-colors">Top New Restaurants</a></li>
              <li><a href="#lists" className="hover:text-white transition-colors">Classical Dining</a></li>
              <li><a href="#lists" className="hover:text-white transition-colors">Casual Dining</a></li>
              <li><a href="#lists" className="hover:text-white transition-colors">Micro Eats</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold uppercase tracking-wider text-stone-300 mb-4">
              Dining Guides
            </h5>
            <ul className="space-y-2.5 text-stone-400 font-light">
              <li><a href="#guides" className="hover:text-white transition-colors">Rome Guide</a></li>
              <li><a href="#guides" className="hover:text-white transition-colors">Barcelona Guide</a></li>
              <li><a href="#guides" className="hover:text-white transition-colors">Lisbon Guide</a></li>
              <li><a href="#guides" className="hover:text-white transition-colors">Paris Guide</a></li>
              <li><a href="#guides" className="hover:text-white transition-colors">Santorini Guide</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold uppercase tracking-wider text-stone-300 mb-4">
              OAD Platform
            </h5>
            <ul className="space-y-2.5 text-stone-400 font-light">
              <li><a href="#about" className="hover:text-white transition-colors">About OAD</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Voting Methodology</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Reviewer Accreditation</a></li>
              <li><a href="#magazine" className="hover:text-white transition-colors">Editorial Magazine</a></li>
              <li><a href="#best-of" className="hover:text-white transition-colors">Travel with OAD</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold uppercase tracking-wider text-stone-300 mb-4">
              Contact & Press
            </h5>
            <ul className="space-y-2.5 text-stone-400 font-light">
              <li><span className="block text-stone-300">Headquarters</span></li>
              <li><span className="block">New York & London</span></li>
              <li className="pt-2"><span className="text-stone-300">Inquiries</span></li>
              <li><span className="block">curators@opinionatedaboutdining.com</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom legal & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 font-light">
          <p>© {new Date().getFullYear()} Opinionated About Dining (OAD). All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-300 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
