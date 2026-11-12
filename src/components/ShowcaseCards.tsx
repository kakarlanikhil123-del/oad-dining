import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  type: 'restaurant' | 'chef' | 'city' | 'region';
  targetId?: string;
}

interface ShowcaseCardsProps {
  onSelectItem: (item: ShowcaseItem) => void;
}

export const showcaseItems: ShowcaseItem[] = [
  {
    id: 'sc-1',
    title: 'Desde 1911',
    subtitle: 'Madrid, Spain',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    type: 'restaurant',
    targetId: 'rest-2'
  },
  {
    id: 'sc-2',
    title: 'Nick Honey',
    subtitle: 'Le Petit Léon, France',
    image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=600&q=80',
    type: 'chef',
    targetId: 'rest-5'
  },
  {
    id: 'sc-3',
    title: 'Rome',
    subtitle: '140 restaurants',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
    type: 'city',
    targetId: 'guide-roma'
  },
  {
    id: 'sc-4',
    title: 'Cracco',
    subtitle: 'Rome, Italy',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    type: 'restaurant',
    targetId: 'rest-4'
  },
  {
    id: 'sc-5',
    title: 'Alchemist',
    subtitle: 'Copenhagen, Denmark',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    type: 'restaurant',
    targetId: 'rest-1'
  },
  {
    id: 'sc-6',
    title: 'Andalusia',
    subtitle: '32 restaurants',
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=600&q=80',
    type: 'region',
    targetId: 'guide-country-spain'
  }
];

export const ShowcaseCards: React.FC<ShowcaseCardsProps> = ({ onSelectItem }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {showcaseItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectItem(item)}
            className="group relative h-40 sm:h-44 rounded-none overflow-hidden text-left focus:outline-none transition-all duration-300 hover:shadow-xl cursor-pointer"
          >
            {/* Background Image */}
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              loading="lazy"
            />

            {/* Dark gradient overlay matching reference */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity group-hover:from-black/95" />

            {/* Content text bottom pinned */}
            <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col justify-end text-white">
              <h4 className="text-sm font-semibold tracking-normal text-white group-hover:underline underline-offset-2 leading-tight">
                {item.title}
              </h4>
              <p className="text-[11px] text-stone-300 font-light mt-0.5 leading-snug">
                {item.subtitle}
              </p>
            </div>

            {/* Top hover indicator */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full p-1">
              <ArrowUpRight className="w-3 h-3 text-white" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
