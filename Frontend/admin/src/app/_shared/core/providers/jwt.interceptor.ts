import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import { AuthService } from '@app/_shared/services/auth/auth.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): any {
    // add auth header with jwt if user is logged in and request is to the api url
    const isLoggedIn = this.auth.getToken();


    if (isLoggedIn) {
      // let role = JSON.parse(this.auth.getRole());
      request = request.clone({
        setHeaders: {
          Authorization: "Bearer " + this.auth.getToken(),
          // "x-uuid-token": this.auth.getUUIDToken(),
          // "role": role ? role : 'CUSTOMER'
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
          if ([401, 411].includes(error.status)) {
            this.auth.logout();
          }
          throw error;
      })
    );
  }
}
