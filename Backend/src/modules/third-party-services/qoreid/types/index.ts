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

export interface IQoreIdBvnResponse {
  bvn: {
    bvn: string;
    phone: string;
    email: string;
    emails: string[];
  };
} 