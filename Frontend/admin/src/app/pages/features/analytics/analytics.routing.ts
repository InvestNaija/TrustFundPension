import { Routes, RouterModule } from '@angular/router';
import { AnalyticsComponent } from './analytics.component';
import { ViewAnalyticsComponent } from './view/view-analytics/view-analytics.component';

export const analyticsRoutes: Routes = [
  {
    path: '',
    component: AnalyticsComponent,
    data: { title: 'Analytics' },
    children: [
      {
        path: 'view',
        data: { title: 'Analytics' },
        component: ViewAnalyticsComponent,
      },

      { path: '', redirectTo: 'view', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/app/analytics/view', pathMatch: 'full' },
];
