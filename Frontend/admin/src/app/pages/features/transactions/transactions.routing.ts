import { Routes, RouterModule } from '@angular/router';
import { TransactionsComponent } from './transactions.component';
import { ViewTransactionsComponent } from './view/view-transactions/view-transactions.component';
import { AllComponent } from './view/view-transactions/all/all.component';
import { PendingComponent } from './view/view-transactions/pending/pending.component';
import { CompletedComponent } from './view/view-transactions/completed/completed.component';

export const transactionRoutes: Routes = [
  {
    path: '',
    component: TransactionsComponent,
    children: [
      {
        path: 'view',
        data: { title: 'Transactions' },
        component: ViewTransactionsComponent,
        children: [
          {
            path: 'all',
            component: AllComponent,
            data: { title: 'Transactions' },
          },
          {
            path: 'pending',
            component: PendingComponent,
            data: { title: 'Transactions' },
          },
          {
            path: 'completed',
            component: CompletedComponent,
            data: { title: 'Transactions' },
          },
          { path: '', redirectTo: 'all', pathMatch: 'full' },
        ],
      },

      { path: '', redirectTo: 'view/all', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/app/transactions/view/all', pathMatch: 'full' },
];
