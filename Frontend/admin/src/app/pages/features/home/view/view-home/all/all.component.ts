import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../../_shared/third-party/material.module';
import { UserProfileComponent } from '../../../details/user-profile/user-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { EmptyStateComponent } from '@app/_shared/ui/components/empty-state/empty-state.component';


@Component({
  selector: 'app-all',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, EmptyStateComponent],
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit {

  container: any = {};

  @Input('allList') allList!: any;

  emptyState = {
    title: 'No User Found',
    subTitle: '',
  };

  constructor(
    public dialog: MatDialog
  ) {}

  ngOnInit() {
  }


  openUserProfileDialog(data?: any): void {
    const userProfileDialog = this.dialog.open(UserProfileComponent, {
      data: {...data},
      width: '550px',
      disableClose: true,
    });

    userProfileDialog.afterClosed().subscribe((result: any) => {

      // callBack();
    });
  }

}
