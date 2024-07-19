import { genSalt, hash } from 'bcrypt';
import prisma from '../prisma';
import { FRONTEND_URL } from '../config';
import usersAction from './users.action';

export class OrganizersAction {
  // IMPORTANT: for public use, do not return sensitive data
  public findOrganizer = async (username: string) => {
    try {
      const organizer = await prisma.user.findFirst({
        where: {
          AND: [
            { username },
            {
              role: {
                name: 'ORGANIZER',
              },
            },
          ],
        },
        select: {
          username: true,
          profile: {
            select: {
              firstname: true,
              lastname: true,
              avatar: true,
            },
          },
        },
      });

      // throw error when the returned organizer is empty
      if (!organizer) throw new Error('Organizer not found');

      const payload = {
        username: organizer.username,
        firstname: organizer.profile?.firstname,
        lastname: organizer.profile?.lastname,
        avatar: organizer.profile?.avatar,
      };

      return payload;
    } catch (error) {
      throw error;
    }
  };
}

export default new OrganizersAction();
