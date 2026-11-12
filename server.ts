import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Database } from './server/data/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Request logger middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (req.path.startsWith('/api')) {
        console.log(`[API] ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
      }
    });
    next();
  });

  // REST API Routes

  // 1. Restaurants
  app.get('/api/restaurants', (req: Request, res: Response) => {
    const { category, region, city, search } = req.query;
    const restaurants = Database.getRestaurants({
      category: category as string,
      region: region as string,
      city: city as string,
      search: search as string
    });
    res.json({ success: true, count: restaurants.length, data: restaurants });
  });

  app.get('/api/restaurants/:id', (req: Request, res: Response) => {
    const restaurant = Database.getRestaurantById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }
    const reviews = Database.getReviews(restaurant.id);
    res.json({ success: true, data: { ...restaurant, reviews } });
  });

  // 2. Guides (City Guides and Country Guides)
  app.get('/api/guides', (req: Request, res: Response) => {
    const { type } = req.query;
    const guides = Database.getGuides(type as 'city' | 'country');
    res.json({ success: true, count: guides.length, data: guides });
  });

  app.get('/api/guides/:id', (req: Request, res: Response) => {
    const guide = Database.getGuideById(req.params.id);
    if (!guide) {
      return res.status(404).json({ success: false, error: 'Guide not found' });
    }
    // Also include matching restaurants in this guide's city/country
    const matchingRestaurants = Database.getRestaurants({
      city: guide.type === 'city' ? guide.name : undefined
    });
    res.json({ success: true, data: { ...guide, restaurants: matchingRestaurants } });
  });

  // 3. Best Of Editorial
  app.get('/api/best-of', (req: Request, res: Response) => {
    const { category } = req.query;
    const articles = Database.getBestOfArticles(category as string);
    res.json({ success: true, count: articles.length, data: articles });
  });

  app.get('/api/best-of/:id', (req: Request, res: Response) => {
    const article = Database.getBestOfArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    res.json({ success: true, data: article });
  });

  // 4. Magazine Articles
  app.get('/api/magazine', (req: Request, res: Response) => {
    const articles = Database.getMagazineArticles();
    res.json({ success: true, count: articles.length, data: articles });
  });

  app.get('/api/magazine/:id', (req: Request, res: Response) => {
    const article = Database.getMagazineArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, error: 'Magazine article not found' });
    }
    res.json({ success: true, data: article });
  });

  // 5. List 2024 Rankings & Statistics
  app.get('/api/lists', (req: Request, res: Response) => {
    const region = (req.query.region as string) || 'Europe';
    const all = Database.getRestaurants({ region: region === 'Global' ? undefined : region });

    const categories = [
      {
        id: 'top-restaurants',
        title: 'Top Restaurants',
        count: 555,
        previewDish: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        restaurants: all.filter(r => r.category === 'Top Restaurants')
      },
      {
        id: 'top-new-restaurants',
        title: 'Top New Restaurants',
        count: 60,
        previewDish: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
        restaurants: all.filter(r => r.category === 'Top New Restaurants')
      },
      {
        id: 'classical',
        title: 'Classical',
        count: 340,
        previewDish: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
        restaurants: all.filter(r => r.category === 'Classical')
      },
      {
        id: 'casual',
        title: 'Casual',
        count: 120,
        previewDish: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
        restaurants: all.filter(r => r.category === 'Casual')
      },
      {
        id: 'micro-eats',
        title: 'Micro Eats',
        count: 98,
        previewDish: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
        restaurants: all.filter(r => r.category === 'Micro Eats')
      }
    ];

    res.json({ success: true, region, categories });
  });

  // 6. Top Reviewers
  app.get('/api/reviewers', (req: Request, res: Response) => {
    const reviewers = Database.getReviewers();
    res.json({ success: true, count: reviewers.length, data: reviewers });
  });

  // 7. Reviews CRUD
  app.get('/api/reviews', (req: Request, res: Response) => {
    const { restaurantId } = req.query;
    const reviews = Database.getReviews(restaurantId as string);
    res.json({ success: true, count: reviews.length, data: reviews });
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    const {
      restaurantId,
      restaurantName,
      reviewerName,
      reviewerTier,
      reviewerCountry,
      visitDate,
      ratingFood,
      ratingCreativity,
      ratingHospitality,
      ratingWine,
      comment,
      dishesOrdered
    } = req.body;

    // Server-side validation
    if (!restaurantId || !reviewerName || !visitDate || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Missing required review fields: restaurantId, reviewerName, visitDate, and comment are required.'
      });
    }

    const foodScore = Number(ratingFood);
    const creativityScore = Number(ratingCreativity);
    const hospitalityScore = Number(ratingHospitality);
    const wineScore = Number(ratingWine);

    if (
      isNaN(foodScore) || foodScore < 1 || foodScore > 10 ||
      isNaN(creativityScore) || creativityScore < 1 || creativityScore > 10 ||
      isNaN(hospitalityScore) || hospitalityScore < 1 || hospitalityScore > 10 ||
      isNaN(wineScore) || wineScore < 1 || wineScore > 10
    ) {
      return res.status(400).json({
        success: false,
        error: 'Rating scores must be valid numbers between 1.0 and 10.0.'
      });
    }

    const savedReview = Database.addReview({
      restaurantId,
      restaurantName: restaurantName || 'Featured Restaurant',
      reviewerName,
      reviewerTier: reviewerTier || 'Senior Taster',
      reviewerCountry: reviewerCountry || 'International',
      visitDate,
      ratingFood: foodScore,
      ratingCreativity: creativityScore,
      ratingHospitality: hospitalityScore,
      ratingWine: wineScore,
      comment,
      dishesOrdered: Array.isArray(dishesOrdered) ? dishesOrdered : []
    });

    res.status(201).json({
      success: true,
      message: 'Review recorded and verified by OAD algorithm!',
      data: savedReview
    });
  });

  // 8. Bookmarks / Saved
  app.get('/api/saved', (req: Request, res: Response) => {
    const saved = Database.getSavedRestaurants();
    res.json({ success: true, count: saved.length, data: saved });
  });

  app.post('/api/saved/:id', (req: Request, res: Response) => {
    const result = Database.toggleSaveRestaurant(req.params.id);
    res.json({ success: true, ...result });
  });

  // 9. Global Search
  app.get('/api/search', (req: Request, res: Response) => {
    const q = (req.query.q as string) || '';
    const results = Database.searchAll(q);
    res.json({ success: true, query: q, data: results });
  });

  // Centralized Error Handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: err.message
    });
  });

  // Vite Integration in Development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OAD Platform] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
