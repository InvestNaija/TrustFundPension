import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../_shared/third-party/material.module';
import { AllComponent } from './all/all.component';
import { PendingComponent } from './pending/pending.component';
import { CompletedComponent } from './completed/completed.component';

@Component({
  selector: 'app-view-transactions',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, AllComponent, PendingComponent, CompletedComponent],
  templateUrl: './view-transactions.component.html',
  styleUrls: ['./view-transactions.component.css']
})
export class ViewTransactionsComponent implements OnInit {
  currentTab: string = 'all';
  constructor(
        private router: Router,
  ) { }

  ngOnInit() {
    this.currentTab = (window.location.href).split('/')[6];
  }

  tabChange(tabName: string) {
    switch(tabName) {
      case 'all':
        this.currentTab = 'all';
        this.router.navigateByUrl('/app/transactions/view/all');
        break;
        case 'pending':
        this.currentTab = 'pending';
        this.router.navigateByUrl('/app/transactions/view/pending');
        break;
        case 'completed':
        this.currentTab = 'completed';
        this.router.navigateByUrl('/app/transactions/view/completed');
        break;
        default:
          this.currentTab = 'all';
          this.router.navigateByUrl('/app/transactions/view/all');
          break;
    }
}

}
