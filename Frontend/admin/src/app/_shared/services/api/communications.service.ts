import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommunicationsService {
  private http = inject(HttpClient);

  getBranchLocator(branchData: any) {
    let params = new HttpParams();
    for (let key in branchData) {
      if (branchData[key]) {
        params = params.append(key, branchData[key]);
      }
    }
    return this.http.get<any>(`${environment.baseUrl}/branches`, {
      params: params,
    });
  }

  addBranchLocator(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/branches`, data);
  }

  updateBranchLocator(data: any, id: string) {
    return this.http.patch<any>(`${environment.baseUrl}/branches/${id}`, data);
  }


    getNotification(notifyData: any) {
    let params = new HttpParams();
    for (let key in notifyData) {
      if (notifyData[key]) {
        params = params.append(key, notifyData[key]);
      }
    }
    return this.http.get<any>(`${environment.baseUrl}/notifications`, {
      params: params,
    });
  }

  addNotification(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/notifications`, data);
  }

  updateNotification(data: any, id: string) {
    return this.http.patch<any>(`${environment.baseUrl}/notifications/${id}`, data);
  }
}
