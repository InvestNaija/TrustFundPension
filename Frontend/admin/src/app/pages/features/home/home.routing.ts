import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { ViewHomeComponent } from './view/view-home/view-home.component';
import { AllComponent } from './view/view-home/all/all.component';
import { ApprovedComponent } from './view/view-home/approved/approved.component';
import { PendingComponent } from './view/view-home/pending/pending.component';
import { RejectedComponent } from './view/view-home/rejected/rejected.component';
import { TransferredComponent } from './view/view-home/transferred/transferred.component';

export const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'view',
        data: { title: 'Home' },
        component: ViewHomeComponent,
        children: [
          {
            path: 'all',
            component: AllComponent,
            data: { title: 'Home' },
          },
          {
            path: 'approved',
            component: ApprovedComponent,
            data: { title: 'Home' },
          },
          {
            path: 'pending',
            component: PendingComponent,
            data: { title: 'Home' },
          },
          {
            path: 'rejected',
            component: RejectedComponent,
            data: { title: 'Home' },
          },
          {
            path: 'transferred',
            component: TransferredComponent,
            data: { title: 'Home' },
          },
          { path: '', redirectTo: 'all', pathMatch: 'full' },
        ],
      },

      { path: '', redirectTo: 'view/all', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/app/home/view/all', pathMatch: 'full' },
];
