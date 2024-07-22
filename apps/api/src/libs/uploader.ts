import { Request } from 'express';
import multer from 'multer';
import { join } from 'path';
import path = require('path');
import { FileFilterCallback } from 'multer';
import { User } from '@/types/express';
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;
type FilterCallback = (error: Error | null, valid: Boolean) => void;

export const uploader = (filePrefix: string, folderName?: string) => {
  try {
    const defaultDir = join(__dirname, '../../public');

    const storage = multer.diskStorage({
      destination: (
        req: Request,
        file: Express.Multer.File,
        cb: DestinationCallback,
      ) => {
        const destination = folderName ? defaultDir + folderName : defaultDir;
        cb(null, destination);
      },
      filename: (
        req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback,
      ) => {
        const { username } = req.user as User;
        const originalNameParts = file.originalname.split('.');
        const fileExtension = originalNameParts[originalNameParts.length - 1];
        const newFileName = `${filePrefix}_${username}_${Date.now()}.${fileExtension}`;

        cb(null, newFileName);
      },
    });

    const filter = (
      req: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback,
    ) => {
      try {
        const extension = path.extname(file.originalname);
        if (
          extension !== '.png' &&
          extension !== '.jpg' &&
          extension !== '.jpeg'
        ) {
          cb(new Error('Extension type is invalid'));
        }
        cb(null, true);
      } catch (err) {
        throw err;
      }
    };

    return multer({
      storage: storage,
      fileFilter: filter,
      limits: { fileSize: 2048 * 2048 },
    });
  } catch (err) {
    throw err;
  }
};
