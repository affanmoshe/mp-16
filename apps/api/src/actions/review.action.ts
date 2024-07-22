import prisma from '../prisma';

class ReviewAction {
  public async createReview(
    customerId: number,
    eventId: number,
    rating: number,
    reviewText: string
  ) {
    try {
      const review = await prisma.review.create({
        data: {
          customerId,
          eventId,
          rating,
          reviewText,
        },
      });
      return review;
    } catch (error) {
      throw error;
    }
  }

  public async getAllReviews() {
    try {
      const reviews = await prisma.review.findMany();
      return reviews;
    } catch (error) {
      throw error;
    }
  }

  public async getReviewsByEventId(eventId: number) {
    try {
      const reviews = await prisma.review.findMany({
        where: {
          eventId,
        },
      });
      return reviews;
    } catch (error) {
      throw error;
    }
  }

  public async updateReviewById(
    id: number,
    rating: number,
    reviewText: string
  ) {
    try {
      const review = await prisma.review.update({
        where: {
          id,
        },
        data: {
          rating,
          reviewText,
        },
      });
      return review;
    } catch (error) {
      throw error;
    }
  }

  public async deleteReviewById(id: number) {
    try {
      const review = await prisma.review.delete({
        where: {
          id,
        },
      });
      return review;
    } catch (error) {
      throw error;
    }
  }
}

export default new ReviewAction();
