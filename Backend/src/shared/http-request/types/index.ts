import { Method } from 'axios';

export interface IHttpRequest {
  method: Method;
  data?: any;
  headers?: any;
  url?: string;
  type?: string;
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';
}
