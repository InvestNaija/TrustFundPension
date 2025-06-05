import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../../_shared/third-party/material.module';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsDetailsComponent } from '../../../details/notifications-details/notifications-details.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-notifications',
  standalone: true,
    imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

   constructor(
          public dialog: MatDialog,
    ) { }

    ngOnInit() {
    }

     openNotificationsDialog(data?: any): void {
         const notificationsDialog = this.dialog.open(NotificationsDetailsComponent, {
           data: {
            create: false
           },
           width: '450px',
           disableClose: true,
         });
         //
         notificationsDialog.afterClosed().subscribe((result: any) => {

           // callBack();
         });
       }

}
