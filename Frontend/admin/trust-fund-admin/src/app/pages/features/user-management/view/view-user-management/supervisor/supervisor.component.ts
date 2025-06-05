import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserManagementDetailComponent } from '../../../details/user-management-detail/user-management-detail.component';

@Component({
  selector: 'app-supervisor',
  standalone: true,
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.css']
})
export class SupervisorComponent implements OnInit {

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
