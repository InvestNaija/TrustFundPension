import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonService } from './common.service';
import { debounceTime, fromEvent, map, merge } from 'rxjs';
const MINUTES_UNITL_AUTO_LOGOUT = 10; // in mins
const CHECK_INTERVAL = 15000; // in ms
const STORE_KEY = 'lastAction';

@Injectable({
  providedIn: 'root',
})
export class AutoLogoutService {
  private readonly debounceTimeMs = 800;

  constructor(
    private router: Router,
    private authService: AuthService,
    private commonService: CommonService
  ) {
    this.check();
    this.initListener();
    this.initInterval();
    localStorage.setItem(STORE_KEY, Date.now().toString());
  }

  public getLastAction(): string | any {
    return localStorage.getItem(STORE_KEY);
  }
  public setLastAction(lastAction: number) {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }
  initListener() {
    const clickEvent$ = fromEvent(document, 'click');
    const mouseoverEvent$ = fromEvent(document, 'mouseover');
    const mouseoutEvent$ = fromEvent(document, 'mouseout');
    const keydownEvent$ = fromEvent(document, 'keydown');
    const keyupEvent$ = fromEvent(document, 'keyup');
    const keypressEvent$ = fromEvent(document, 'keypress');

    merge(
      clickEvent$,
      mouseoverEvent$,
      mouseoutEvent$,
      keydownEvent$,
      keyupEvent$,
      keypressEvent$
    )
      .pipe(
        map(() => {
          this.reset();
        }),
        debounceTime(this.debounceTimeMs)
      )
      .subscribe((searchValue) => {});
  }

  reset() {
    if (this.authService.isLoggedIn()) {
      this.setLastAction(Date.now());
    }
  }

  initInterval() {
    if (this.authService.isLoggedIn()) {
      setInterval(() => {
        this.check();
      }, CHECK_INTERVAL);
    }
  }

  check() {
    if (this.authService.isLoggedIn()) {
      const now = Date.now();
      const timeleft =
        parseInt(this.getLastAction()) + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
      const diff = timeleft - now;
      const isTimeout = diff < 0;

      if (
        isTimeout &&
        !localStorage.getItem('rememberMe') &&
        localStorage.getItem('trustfund-jwt')
      ) {
        this.commonService.snackBar(this.commonService?.snackbarIcon?.error,
          'Your session has expired! Please login to continue.',
          'error'
        );
        localStorage.removeItem(STORE_KEY);
        this.authService.logout();
      }
    }
  }
}
