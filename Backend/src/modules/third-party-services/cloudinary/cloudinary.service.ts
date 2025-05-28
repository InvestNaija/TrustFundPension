/* eslint-disable camelcase */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import {
  CloudinaryUploadResponse,
  CloudinaryResponse,
  FileParams,
} from './types';
import { envConfig } from '../../../core/config';

// Configure Cloudinary
const cloudinaryUrl = `cloudinary://${envConfig.CLOUDINARY_API_KEY}:${envConfig.CLOUDINARY_API_SECRET}@${envConfig.CLOUDINARY_CLOUD_NAME}`;
cloudinary.config(cloudinaryUrl);

@Injectable()
export class CloudinaryService {

  async upload(file: Express.Multer.File): Promise<CloudinaryResponse> {
    try {
      const uploaded = await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'trustfund'
          },
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
          file_type: file.mimetype,
          file_size: file.size,
          format: uploaded.format,
          bytes: uploaded.bytes,
          width: uploaded.width,
          height: uploaded.height
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
      await cloudinary.api.delete_resources([publicId.id]);
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