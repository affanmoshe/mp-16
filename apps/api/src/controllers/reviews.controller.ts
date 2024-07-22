import { NextFunction, Request, Response } from 'express';
import reviewAction from '@/actions/review.action';

export class ReviewController {
  private errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }

  public createReviewController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { customerId, eventId, rating, reviewText } = req.body;

      const review = await reviewAction.createReview(
        customerId,
        eventId,
        rating,
        reviewText
      );

      res.status(201).json({
        message: 'Review created successfully',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllReviewsController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const reviews = await reviewAction.getAllReviews();
      res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  };

  public getReviewsByEventIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const reviews = await reviewAction.getReviewsByEventId(eventId);
      res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  };

  public updateReviewByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const reviewId = parseInt(req.params.id);
      const { rating, reviewText } = req.body;

      const updatedReview = await reviewAction.updateReviewById(
        reviewId,
        rating,
        reviewText
      );

      res.status(200).json({
        message: 'Review updated successfully',
        data: updatedReview,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteReviewByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const reviewId = parseInt(req.params.id);
      const deletedReview = await reviewAction.deleteReviewById(reviewId);
      res.status(200).json({
        message: 'Review deleted successfully',
        data: deletedReview,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new ReviewController();
