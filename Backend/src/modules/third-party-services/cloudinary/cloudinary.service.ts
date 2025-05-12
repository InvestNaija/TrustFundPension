/* eslint-disable camelcase */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { v2 } from 'cloudinary';
import {
  CloudinaryUploadResponse,
  CloudinaryResponse,
  FileParams,
} from './types';
import { cloudinaryConfig } from './cloudinary.config';

v2.config(cloudinaryConfig);

@Injectable()
export class CloudinaryService {

  async upload(file: Express.Multer.File): Promise<CloudinaryResponse> {
    try {
      const uploaded = await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
        const uploadStream = v2.uploader.upload_stream(
          (error, result) => {
            if (error) {
              reject(error);
            } else if (!result) {
              reject(new Error('Upload failed: No result returned'));
            } else {
              resolve(result as CloudinaryUploadResponse);
            }
          },
        );

        uploadStream.end(file.buffer);
      });

      return {
        success: true,
        status: 200,
        data: {
          id: uploaded.public_id,
          service: 'cloudinary',
          url: uploaded.secure_url,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(publicId: { id: string }): Promise<CloudinaryResponse> {
    try {
      await v2.api.delete_resources([publicId.id]);
      return {
        success: true,
        status: 200,
        message: `Record with ID: ${publicId.id} deleted successfully`,
      };
    } catch (error) {
      console.error(error.message);
      throw new HttpException(
        {
          success: false,
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}