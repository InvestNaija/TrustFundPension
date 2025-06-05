import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserManagementDetailComponent } from '../../../details/user-management-detail/user-management-detail.component';

@Component({
  selector: 'app-manager',
  standalone: true,
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

  constructor(
           public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

    openUserManagementDialog(data?: any): void {
      const userManagementDialog = this.dialog.open(UserManagementDetailComponent, {
        data: {
          create: false
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
