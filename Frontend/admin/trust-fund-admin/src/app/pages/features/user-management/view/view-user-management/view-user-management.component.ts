import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AllComponent } from './all/all.component';
import { OperatorComponent } from './operator/operator.component';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { ManagerComponent } from './manager/manager.component';
import { MaterialModule } from '../../../../../_shared/third-party/material.module';
import { MatDialog } from '@angular/material/dialog';
import { UserManagementDetailComponent } from '../../details/user-management-detail/user-management-detail.component';

@Component({
  selector: 'app-view-user-management',
  standalone: true,
    imports: [CommonModule, RouterModule,  MaterialModule, AllComponent, OperatorComponent, SupervisorComponent, ManagerComponent],
  templateUrl: './view-user-management.component.html',
  styleUrls: ['./view-user-management.component.css']
})
export class ViewUserManagementComponent implements OnInit {
  currentTab: string = 'all';
  constructor(
        private router: Router,
        public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.currentTab = (window.location.href).split('/')[6];
  }

  tabChange(tabName: string) {
    switch(tabName) {
      case 'all':
        this.currentTab = 'all';
        this.router.navigateByUrl('/app/user-management/view/all');
        break;
        case 'operator':
        this.currentTab = 'operator';
        this.router.navigateByUrl('/app/user-management/view/operator');
        break;
        case 'supervisor':
        this.currentTab = 'supervisor';
        this.router.navigateByUrl('/app/user-management/view/supervisor');
        break;
        case 'manager':
          this.currentTab = 'manager';
          this.router.navigateByUrl('/app/user-management/view/manager');
          break;
        default:
          this.currentTab = 'all';
          this.router.navigateByUrl('/app/user-management/view/all');
          break;
    }
}
  openUserManagementDialog(data?: any): void {
    const userManagementDialog = this.dialog.open(UserManagementDetailComponent, {
      data: {
        create: true
      },
      width: '450px',
      disableClose: true,
    });


    //
    userManagementDialog.afterClosed().subscribe((result: any) => {

      // callBack();
    });
  }

}
