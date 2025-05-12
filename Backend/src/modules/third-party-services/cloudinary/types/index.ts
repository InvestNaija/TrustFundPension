import { UploadApiResponse } from 'cloudinary';

export interface IQoreIdNinResponse {
  nin: {
    nin: string;
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    emails: string[];
  };
}

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  [key: string]: any;  // Allow other properties from UploadApiResponse
}

export interface CloudinaryResponse {
  success: boolean;
  status: number;
  data?: {
    id?: string;
    service?: string;
    url?: string;
  };
  message?: string;
}

export interface FileUpload {
  data: Buffer;
}

export interface FileParams {
  id?: string;
  url?: string;
} 