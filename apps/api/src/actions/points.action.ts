import fs from 'fs';
import * as handlebars from 'handlebars';
import path from 'path';
import prisma from '../prisma';
import { FRONTEND_URL, NODEMAILER_EMAIL } from '../config';
import usersAction from './users.action';

export class PointsAction {
  public redeemAction = async (id: number, price: number) => {
    try {
      const userPoints = await prisma.point.findMany({
        where: {
          pointsOwnerId: id,
          pointsExpiry: {
            gt: new Date(),
          },
          pointsRemaining: {
            gt: 0,
          },
        },
        orderBy: {
          pointsExpiry: 'asc',
        },
      });

      const totalAvailablePoints = userPoints.reduce(
        (acc, point) => acc + point.pointsRemaining,
        0,
      );

      // calculate the points needed to cover the price
      let pointsToRedeem = Math.min(price, totalAvailablePoints);

      // if no points are available or the price is zero, return the original price
      if (pointsToRedeem <= 0 || price <= 0) return price;

      let totalRedeemed = 0;
      await prisma.$transaction(async (tx) => {
        for (const point of userPoints) {
          if (pointsToRedeem <= 0) break;

          const redeemable = Math.min(point.pointsRemaining, pointsToRedeem);
          pointsToRedeem -= redeemable;
          totalRedeemed += redeemable;

          await tx.point.update({
            where: { id: point.id },
            data: {
              pointsRemaining: point.pointsRemaining - redeemable,
            },
          });
        }
      });

      // const finalPrice = price - totalRedeemed;

      return totalRedeemed;
    } catch (error) {
      throw error;
    }
  };

  public getAllPointsAction = async (id: number) => {
    try {
      const userPoints = await prisma.point.findMany({
        where: {
          pointsOwnerId: id,
          pointsExpiry: {
            gt: new Date(),
          },
          pointsRemaining: {
            gt: 0,
          },
        },
        orderBy: {
          pointsExpiry: 'asc',
        },
      });

      if (!userPoints) throw new Error('User not found');

      const totalPoints = userPoints.reduce(
        (acc, point) => acc + point.pointsRemaining,
        0,
      );

      return totalPoints;
    } catch (error) {
      throw error;
    }
  };
}

export default new PointsAction();
