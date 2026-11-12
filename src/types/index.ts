export interface Restaurant {
  id: string;
  name: string;
  city: string;
  country: string;
  region: 'Europe' | 'North America' | 'Asia' | 'Latin America';
  category: 'Top Restaurants' | 'Top New Restaurants' | 'Classical' | 'Casual' | 'Micro Eats';
  rank: number;
  score: number; // e.g. 98.4
  stars: number; // Michelin stars: 1, 2, 3
  chef: string;
  cuisine: string;
  priceRange: '€€' | '€€€' | '€€€€';
  image: string;
  dishImage: string;
  description: string;
  address: string;
  website: string;
  phone: string;
  reviewsCount: number;
  highlightDish: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  restaurantName: string;
  reviewerName: string;
  reviewerTier: 'Grand Connoisseur' | 'Master Reviewer' | 'Senior Taster' | 'Culinary Explorer';
  reviewerCountry: string;
  visitDate: string;
  ratingFood: number; // 1-10
  ratingCreativity: number; // 1-10
  ratingHospitality: number; // 1-10
  ratingWine: number; // 1-10
  overallScore: number; // computed
  comment: string;
  dishesOrdered: string[];
  createdAt: string;
}

export interface Guide {
  id: string;
  name: string;
  type: 'city' | 'country';
  country?: string;
  restaurantCount: number;
  image: string;
  description: string;
  topCuisines: string[];
  featuredRestaurant: string;
}

export interface BestOfArticle {
  id: string;
  category: 'Food' | 'City' | 'Chefs';
  tag: string;
  title: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
}

export interface MagazineArticle {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  readTime: string;
  image: string;
  category: string;
  date: string;
  content: string;
}

export interface Reviewer {
  id: string;
  name: string;
  avatar: string;
  country: string;
  tier: string;
  reviewsCount: number;
  starredVisited: number;
  bio: string;
}
