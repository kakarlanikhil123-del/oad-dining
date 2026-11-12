import { Restaurant, Guide, BestOfArticle, MagazineArticle, Reviewer, Review } from '../types/index.ts';

export const Api = {
  async getRestaurants(params?: { category?: string; region?: string; city?: string; search?: string }): Promise<Restaurant[]> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.region) searchParams.set('region', params.region);
    if (params?.city) searchParams.set('city', params.city);
    if (params?.search) searchParams.set('search', params.search);

    const res = await fetch(`/api/restaurants?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch restaurants');
    const data = await res.json();
    return data.data;
  },

  async getRestaurantById(id: string): Promise<Restaurant & { reviews: Review[] }> {
    const res = await fetch(`/api/restaurants/${id}`);
    if (!res.ok) throw new Error('Failed to fetch restaurant details');
    const data = await res.json();
    return data.data;
  },

  async getGuides(type?: 'city' | 'country'): Promise<Guide[]> {
    const url = type ? `/api/guides?type=${type}` : '/api/guides';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch guides');
    const data = await res.json();
    return data.data;
  },

  async getGuideById(id: string): Promise<Guide & { restaurants: Restaurant[] }> {
    const res = await fetch(`/api/guides/${id}`);
    if (!res.ok) throw new Error('Failed to fetch guide details');
    const data = await res.json();
    return data.data;
  },

  async getBestOfArticles(category?: string): Promise<BestOfArticle[]> {
    const url = category ? `/api/best-of?category=${category}` : '/api/best-of';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch best of articles');
    const data = await res.json();
    return data.data;
  },

  async getBestOfArticleById(id: string): Promise<BestOfArticle> {
    const res = await fetch(`/api/best-of/${id}`);
    if (!res.ok) throw new Error('Failed to fetch article');
    const data = await res.json();
    return data.data;
  },

  async getMagazineArticles(): Promise<MagazineArticle[]> {
    const res = await fetch('/api/magazine');
    if (!res.ok) throw new Error('Failed to fetch magazine articles');
    const data = await res.json();
    return data.data;
  },

  async getLists(region = 'Europe') {
    const res = await fetch(`/api/lists?region=${encodeURIComponent(region)}`);
    if (!res.ok) throw new Error('Failed to fetch ranked lists');
    return await res.json();
  },

  async getReviewers(): Promise<Reviewer[]> {
    const res = await fetch('/api/reviewers');
    if (!res.ok) throw new Error('Failed to fetch reviewers');
    const data = await res.json();
    return data.data;
  },

  async getReviews(restaurantId?: string): Promise<Review[]> {
    const url = restaurantId ? `/api/reviews?restaurantId=${restaurantId}` : '/api/reviews';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    const data = await res.json();
    return data.data;
  },

  async submitReview(review: {
    restaurantId: string;
    restaurantName: string;
    reviewerName: string;
    reviewerTier?: string;
    reviewerCountry?: string;
    visitDate: string;
    ratingFood: number;
    ratingCreativity: number;
    ratingHospitality: number;
    ratingWine: number;
    comment: string;
    dishesOrdered?: string[];
  }): Promise<Review> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to submit review');
    }
    return result.data;
  },

  async toggleSaveRestaurant(id: string): Promise<{ isSaved: boolean; savedIds: string[] }> {
    const res = await fetch(`/api/saved/${id}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to update bookmark');
    return await res.json();
  },

  async getSavedRestaurants(): Promise<Restaurant[]> {
    const res = await fetch('/api/saved');
    if (!res.ok) throw new Error('Failed to fetch saved restaurants');
    const data = await res.json();
    return data.data;
  },

  async search(query: string) {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    const data = await res.json();
    return data.data;
  }
};
