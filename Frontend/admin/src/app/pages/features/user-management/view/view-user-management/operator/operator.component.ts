import { Component, OnInit } from '@angular/core';
import { UserManagementDetailComponent } from '../../../details/user-management-detail/user-management-detail.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-operator',
  standalone: true,
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.css']
})
export class OperatorComponent implements OnInit {

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
