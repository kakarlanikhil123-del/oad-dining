import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Restaurant, Guide, BestOfArticle, MagazineArticle, Reviewer, Review } from '../../src/types/index.ts';
import { initialRestaurants, initialGuides, initialBestOfArticles, initialMagazineArticles, initialReviewers, initialReviews } from './initialData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, '..', '..', 'oad_database.json');

export interface DatabaseSchema {
  restaurants: Restaurant[];
  guides: Guide[];
  bestOfArticles: BestOfArticle[];
  magazineArticles: MagazineArticle[];
  reviewers: Reviewer[];
  reviews: Review[];
  savedRestaurantIds: string[];
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to read db file, re-initializing with seed data:', err);
  }

  const defaultDb: DatabaseSchema = {
    restaurants: initialRestaurants,
    guides: initialGuides,
    bestOfArticles: initialBestOfArticles,
    magazineArticles: initialMagazineArticles,
    reviewers: initialReviewers,
    reviews: initialReviews,
    savedRestaurantIds: ['rest-1', 'rest-2', 'rest-4']
  };

  saveDatabase(defaultDb);
  return defaultDb;
}

function saveDatabase(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write db file:', err);
  }
}

// In-memory cache synced to disk
let db = loadDatabase();

export const Database = {
  // Restaurants
  getRestaurants: (params?: { category?: string; region?: string; city?: string; search?: string }) => {
    let result = [...db.restaurants];
    if (params?.category) {
      result = result.filter(r => r.category.toLowerCase() === params.category?.toLowerCase());
    }
    if (params?.region && params.region !== 'Global') {
      result = result.filter(r => r.region.toLowerCase() === params.region?.toLowerCase());
    }
    if (params?.city) {
      result = result.filter(r => r.city.toLowerCase() === params.city?.toLowerCase());
    }
    if (params?.search) {
      const s = params.search.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(s) ||
        r.city.toLowerCase().includes(s) ||
        r.country.toLowerCase().includes(s) ||
        r.chef.toLowerCase().includes(s) ||
        r.cuisine.toLowerCase().includes(s)
      );
    }
    return result;
  },

  getRestaurantById: (id: string) => {
    return db.restaurants.find(r => r.id === id);
  },

  // Guides
  getGuides: (type?: 'city' | 'country') => {
    if (type) {
      return db.guides.filter(g => g.type === type);
    }
    return db.guides;
  },

  getGuideById: (id: string) => {
    return db.guides.find(g => g.id === id);
  },

  // Best Of
  getBestOfArticles: (category?: string) => {
    if (category) {
      return db.bestOfArticles.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }
    return db.bestOfArticles;
  },

  getBestOfArticleById: (id: string) => {
    return db.bestOfArticles.find(a => a.id === id);
  },

  // Magazine
  getMagazineArticles: () => {
    return db.magazineArticles;
  },

  getMagazineArticleById: (id: string) => {
    return db.magazineArticles.find(a => a.id === id);
  },

  // Reviewers
  getReviewers: () => {
    return db.reviewers;
  },

  // Reviews
  getReviews: (restaurantId?: string) => {
    if (restaurantId) {
      return db.reviews.filter(rev => rev.restaurantId === restaurantId);
    }
    return db.reviews;
  },

  addReview: (reviewData: Omit<Review, 'id' | 'createdAt' | 'overallScore'>) => {
    const overallScore = Number(
      ((reviewData.ratingFood * 0.4) + 
       (reviewData.ratingCreativity * 0.25) + 
       (reviewData.ratingHospitality * 0.2) + 
       (reviewData.ratingWine * 0.15)).toFixed(1)
    );

    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}`,
      overallScore,
      createdAt: new Date().toISOString()
    };

    db.reviews.unshift(newReview);

    // Update restaurant review count and score
    const targetRestaurant = db.restaurants.find(r => r.id === reviewData.restaurantId);
    if (targetRestaurant) {
      targetRestaurant.reviewsCount += 1;
      const allRestReviews = db.reviews.filter(r => r.restaurantId === targetRestaurant.id);
      const avgScore = allRestReviews.reduce((sum, r) => sum + r.overallScore, 0) / allRestReviews.length;
      targetRestaurant.score = Number((targetRestaurant.score * 0.9 + (avgScore * 10) * 0.1).toFixed(1));
    }

    saveDatabase(db);
    return newReview;
  },

  // Bookmarks
  getSavedRestaurants: () => {
    return db.restaurants.filter(r => db.savedRestaurantIds.includes(r.id));
  },

  toggleSaveRestaurant: (restaurantId: string) => {
    const index = db.savedRestaurantIds.indexOf(restaurantId);
    let isSaved = false;
    if (index > -1) {
      db.savedRestaurantIds.splice(index, 1);
      isSaved = false;
    } else {
      db.savedRestaurantIds.push(restaurantId);
      isSaved = true;
    }
    saveDatabase(db);
    return { isSaved, savedIds: db.savedRestaurantIds };
  },

  // Live global search
  searchAll: (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return { restaurants: [], guides: [], articles: [] };

    const restaurants = db.restaurants.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.country.toLowerCase().includes(q) ||
      r.chef.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q)
    );

    const guides = db.guides.filter(g =>
      g.name.toLowerCase().includes(q) ||
      (g.country && g.country.toLowerCase().includes(q)) ||
      g.description.toLowerCase().includes(q)
    );

    const articles = [
      ...db.bestOfArticles.map(b => ({ ...b, type: 'best-of' })),
      ...db.magazineArticles.map(m => ({ ...m, type: 'magazine' }))
    ].filter(a =>
      a.title.toLowerCase().includes(q) ||
      (a.content && a.content.toLowerCase().includes(q))
    );

    return { restaurants, guides, articles };
  }
};
