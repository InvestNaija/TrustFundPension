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
  format: string;
  bytes: number;
  width: number;
  height: number;
  [key: string]: any;  // Allow other properties from UploadApiResponse
}

export interface CloudinaryResponse {
  success: boolean;
  status: number;
  data?: {
    id?: string;
    service?: string;
    url?: string;
    file_type?: string;
    file_size?: number;
    format?: string;
    bytes?: number;
    width?: number;
    height?: number;
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