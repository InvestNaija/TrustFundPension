import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { debounceTime, filter, fromEvent, map, Observable, pairwise, Subscription, throttleTime } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MaterialModule } from '../../_shared/third-party/material.module';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '@app/_shared/services/auth/auth.service';
import { ApplicationContextService } from '@app/_shared/services/common/application-context.service';
import { UserDO } from '@app/_shared/ui/models/users/user-models';
import { SharedModule } from '@app/_shared/shared.module';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, SharedModule],
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {
  userSubscription$!: Subscription;
  userInformation!: any;
  @ViewChild('sidenav') sidenav: any;
  @ViewChild(CdkVirtualScrollViewport) scroller!: CdkVirtualScrollViewport;

  sideNavMode: any = 'side';
  sideNavOpen = true;
  resizeObservable$!: Observable<Event>;
  sidenavSubscription$!: Subscription;
  sidenavClickSubscription$!: Subscription;
  isDialogOpen: boolean = false;
  role: any;

  getTitleName: string = 'Home';
  tab: string = 'what new';
  hidden: boolean = false;

  constructor(
    private authService: AuthService,
    private appContext: ApplicationContextService,
    // private http: HttpClient,
    private ngZone: NgZone,
    private router: Router,
    private titleService: Title,
    private auth: AuthService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.getUserInformation();
    }

    this.setupSideBar();
    this.sidenavFunction();

    this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route: ActivatedRoute = this.router.routerState.root;
        let routeTitle = '';
        while (route!.firstChild) {
          route = route.firstChild;
        }
        if (route.snapshot.data['title']) {
          routeTitle = route!.snapshot.data['title'];
        }
        return routeTitle;
      })
    )
    .subscribe((title: string) => {
      if (title) {
        this.getTitleName= title;
      }
    });
  }

  getUserInformation() {
    this.authService.getUser().subscribe((response: any) => {
        if (response) {
          this.userInformation = response;
          this.appContext.userInformation$.next(response);
        }
      },
      (error: any) => {},
    );
  }

  ngAfterViewInit() {
    this.scroller
      ?.elementScrolled()
      .pipe(
        map(() => this.scroller.measureScrollOffset('bottom')),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < 140),
        throttleTime(200)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          // this.fetchMore();
        });
      });
  }

  setupSideBar() {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.sidenavSubscription$ = this.resizeObservable$
      .pipe(debounceTime(500))
      .subscribe((evt: any) => this.sidenavFunction());

    // let button = document.querySelectorAll('.menu-section-bottom a');
    // let sidenavClick$ = fromEvent(button, 'click');

    // this.sidenavClickSubscription$ = sidenavClick$.subscribe((evt) => {
    //   if (window.innerWidth < 991) {
    //     this.sidenav.close();
    //   }
    // });
  }

  sidenavFunction() {
    let browserWidth = window.innerWidth;
    if (browserWidth < 991) {
      this.sideNavMode = 'over';
      this.sideNavOpen = false;
    } else {
      this.sideNavMode = 'side';
      this.sideNavOpen = true;
    }
  }

  logout() {
    this.auth.logout();
  }

  ngOnDestroy() {
    if (this.sidenavSubscription$) this.sidenavSubscription$.unsubscribe();
    if (this.sidenavClickSubscription$)
      this.sidenavClickSubscription$.unsubscribe();
    // if (this.auth.isLoggedIn()) {
    //   this.userSubscription$.unsubscribe();
    // }
  }
}

