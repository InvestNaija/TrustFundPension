import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../_shared/third-party/material.module';
import { FaqsComponent } from './faqs/faqs.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { ContactComponent } from './contact/contact.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { FaqsDetailsComponent } from '../../details/faqs-details/faqs-details.component';
import { MatDialog } from '@angular/material/dialog';
import { PromotionsDetailsComponent } from '../../details/promotions-details/promotions-details.component';
import { ContactDetailsComponent } from '../../details/contact-details/contact-details.component';
import { NotificationsDetailsComponent } from '../../details/notifications-details/notifications-details.component';
import { BranchLocatorDetailsComponent } from '../../details/branch-locator-details/branch-locator-details.component';
import { BranchLocatorComponent } from './branch-locator/branch-locator.component';
import { CommunicationsService } from '@app/_shared/services/api/communications.service';

@Component({
  selector: 'app-view-communications',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FaqsComponent,
    PromotionsComponent,
    ContactComponent,
    NotificationsComponent,
    BranchLocatorComponent,
  ],
  templateUrl: './view-communications.component.html',
  styleUrls: ['./view-communications.component.css'],
})
export class ViewCommunicationsComponent implements OnInit {
  currentTab: string = 'faqs';
  btnName: string = 'Create FAQ';

  branchList: any[] = [];
  branchUpdated: boolean = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentTab = window.location.href.split('/')[6];
    this.tabChange(this.currentTab);
  }

  tabChange(tabName: string) {
    switch (tabName) {
      case 'faqs':
        this.currentTab = 'faqs';
        this.btnName = 'Create FAQ';
        this.router.navigateByUrl('/app/communications/view/faqs');
        break;
      case 'promotions':
        this.currentTab = 'promotions';
        this.btnName = 'Add new';
        this.router.navigateByUrl('/app/communications/view/promotions');
        break;
      case 'contact':
        this.currentTab = 'contact';
        this.btnName = 'Add new';
        this.router.navigateByUrl('/app/communications/view/contact');
        break;
      case 'notifications':
        this.currentTab = 'notifications';
        this.btnName = 'Add new';
        this.router.navigateByUrl('/app/communications/view/notifications');
        break;
      case 'branch':
        this.currentTab = 'branch';
        this.btnName = 'Add new';
        this.router.navigateByUrl('/app/communications/view/branch');
        break;
        break;
      default:
        this.currentTab = 'faqs';
        this.btnName = 'Create FAQ';
        this.router.navigateByUrl('/app/communications/view/faqs');
        break;
    }
  }

  create(tabName: string) {
    switch (tabName) {
      case 'faqs':
        this.openFaqsDialog();
        break;
      case 'promotions':
        this.openPromotionsDialog();
        break;
      case 'contact':
        // this.openContactDialog();
        break;
      case 'notifications':
        this.openNotificationsDialog();
        break;
      case 'branch':
        this.openBranchDialog();
        break;
      default:
        this.openFaqsDialog();
        break;
    }
  }

  openFaqsDialog(data?: any): void {
    const faqsDialog = this.dialog.open(FaqsDetailsComponent, {
      data: {
        create: true,
      },
      width: '450px',
      disableClose: true,
    });
    //
    faqsDialog.afterClosed().subscribe((result: any) => {
      // callBack();
    });
  }

  openPromotionsDialog(data?: any): void {
    const promotionsDialog = this.dialog.open(PromotionsDetailsComponent, {
      data: {
        create: true,
      },
      width: '450px',
      disableClose: true,
    });
    //
    promotionsDialog.afterClosed().subscribe((result: any) => {
      // callBack();
    });
  }

  openContactDialog(data?: any): void {
    const contactDialog = this.dialog.open(ContactDetailsComponent, {
      data: {
        create: true,
      },
      width: '450px',
      disableClose: true,
    });
    //
    contactDialog.afterClosed().subscribe((result: any) => {
      // callBack();
    });
  }

  openNotificationsDialog(data?: any): void {
    const notificationsDialog = this.dialog.open(
      NotificationsDetailsComponent,
      {
        data: {
          create: true,
        },
        width: '450px',
        disableClose: true,
      }
    );
    //
    notificationsDialog.afterClosed().subscribe((result: any) => {
      location.reload();
      // callBack();
    });
  }

  openBranchDialog(data?: any): void {
    const branchDialog = this.dialog.open(BranchLocatorDetailsComponent, {
      data: {
        create: true,
      },
      width: '450px',
      disableClose: true,
    });
    //
    branchDialog.afterClosed().subscribe((result: any) => {
      this.branchUpdated = true;
      location.reload();
    });
  }
}
