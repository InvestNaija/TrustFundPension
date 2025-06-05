import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
private http = inject(HttpClient);
constructor() { }



getAllUSers = (userData: any) => {
  let params = new HttpParams();

  for (let key in userData) {
    if (userData[key]) {
      params = params.append(key, userData[key]);
    }
  }
      return this.http
         .get<any>(`${environment.baseUrl}/users/all`, {
          params: params,
        });
}


}

