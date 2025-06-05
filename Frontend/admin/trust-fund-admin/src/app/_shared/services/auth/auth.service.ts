import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoginDTO, LoginResponseDO } from '@app/_shared/ui/models/auth/login-models';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private http = inject(HttpClient);

    // store the URL so we can redirect after logging in
    redirectUrl: any;

    landlordStorageKey = 'trustfund-jwt';
    submitting: boolean = false;
    role: string =  '';

    constructor() {}

    setToken(data: any) {
      localStorage.setItem(this.landlordStorageKey, data?.accessToken);
    }

    getToken(): string | any {
      return localStorage.getItem(this.landlordStorageKey);
    }

    getRole() {
      return this.role;
    }

   login = (fd: LoginDTO): any => {
     return this.http
        .post<any>(`${environment.baseUrl}/auth/login`, fd);
    };

    getUser = (): any => {
      return this.http
         .get<any>(`${environment.baseUrl}/users`);
     };


    isLoggedIn() {
      return (
        this.getToken() !== '' &&
        this.getToken() !== null &&
        this.getToken() !== 'null' &&
        this.getToken() !== undefined &&
        this.getToken() !== 'undefined'
      );
    }

    logout(url?: string) {
      localStorage.removeItem(this.landlordStorageKey);
      localStorage.clear();
      this.redirectUrl = url;
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }


    changePassword = (data: any): any => {
      let param = new HttpParams().append('new_password', data.newPassword);

      return this.http.get(environment.baseUrl + '.update_password', {
        params: param,
      });
    };

  }
