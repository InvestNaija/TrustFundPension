import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../../_shared/third-party/material.module';
import { UserProfileComponent } from '../../../details/user-profile/user-profile.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-rejected',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './rejected.component.html',
  styleUrls: ['./rejected.component.css']
})
export class RejectedComponent implements OnInit {

  container: any = {};
  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {

  }


  openUserProfileDialog(data?: any): void {
    const userProfileDialog = this.dialog.open(UserProfileComponent, {
      data: {},
      width: '450px',
      disableClose: true,
    });
    //
    userProfileDialog.afterClosed().subscribe((result: any) => {

      // callBack();
    });
  }
}
