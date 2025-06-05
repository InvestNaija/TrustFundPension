import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationContextService {

  userInformation$ = new BehaviorSubject<any>(null);

  constructor() { }

   //-------------------- User Information Observable ---------------------------//

   getUserInformation(): Observable<any> {
    return this.userInformation$.asObservable();
  }

  //-------------------------- User Information Observable ---------------------//
}
