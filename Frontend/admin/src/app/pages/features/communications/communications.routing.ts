import { Routes, RouterModule } from '@angular/router';
import { CommunicationsComponent } from './communications.component';
import { ViewCommunicationsComponent } from './view/view-communications/view-communications.component';
import { FaqsComponent } from './view/view-communications/faqs/faqs.component';
import { PromotionsComponent } from './view/view-communications/promotions/promotions.component';
import { ContactComponent } from './view/view-communications/contact/contact.component';
import { NotificationsComponent } from './view/view-communications/notifications/notifications.component';
import { BranchLocatorComponent } from './view/view-communications/branch-locator/branch-locator.component';

export const communicationsRoutes: Routes = [
  {
    path: '',
    component: CommunicationsComponent,
    children: [
      {
        path: 'view',
        data: { title: 'Communications' },
        component: ViewCommunicationsComponent,
        children: [
          {
            path: 'faqs',
            component: FaqsComponent,
            data: { title: 'Communications' },
          },
          {
            path: 'promotions',
            component: PromotionsComponent,
            data: { title: 'Communications' },
          },
          {
            path: 'contact',
            component: ContactComponent,
            data: { title: 'Communications' },
          },
          {
            path: 'notifications',
            component: NotificationsComponent,
            data: { title: 'Communications' },
          },
          {
            path: 'branch',
            component: BranchLocatorComponent,
            data: { title: 'Communications' },
          },
          { path: '', redirectTo: 'faqs', pathMatch: 'full' },
        ],
      },

      { path: '', redirectTo: 'view/faqs', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/app/communications/view/faqs', pathMatch: 'full' },
];
