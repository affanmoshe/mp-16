import reviewsController, { ReviewController } from '@/controllers/reviews.controller';
import { Router } from 'express';


export class ReviewRouter {
  private router: Router;
  private reviewController: ReviewController;

  constructor() {
    this.reviewController = new ReviewController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/create-review', this.reviewController.createReviewController);
    this.router.get('/reviews', this.reviewController.getAllReviewsController);
    this.router.get('/review?id', this.reviewController.getReviewsByEventIdController);
    this.router.patch('/update-review?id', this.reviewController.updateReviewByIdController);
    this.router.delete('/delete-review?id', this.reviewController.deleteReviewByIdController);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new ReviewRouter().getRouter();
