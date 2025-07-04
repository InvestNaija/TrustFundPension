import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

private http = inject(HttpClient);

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


getPensionDetails = (id: string) => {
      return this.http
         .get<any>(`${environment.baseUrl}/pension/admin/account-manager/${id}`);
}

getEmployerDetails = (id: string) => {
  return this.http
     .get<any>(`${environment.baseUrl}/employers/admin/${id}`);
}

getNOKDetails = (id: string) => {
  return this.http
     .get<any>(`${environment.baseUrl}/noks/admin/${id}`);
}

getMediaDetails = (id: string) => {
  return this.http
     .get<any>(`${environment.baseUrl}/media/admin/${id}`);
}

getBVN = (id: string) => {
  return this.http
     .get<any>(`${environment.baseUrl}/bvn-data/admin/${id}`);
}

SendToTrustFund = (data: any) => {
  return this.http
     .post<any>(`${environment.baseUrl}/pension/admin/onboarding/${data?.id}`, {});
}

updateUser = (data: any) => {
  return this.http
     .put<any>(`${environment.baseUrl}/users/${data?.id}`, data);
}

}

