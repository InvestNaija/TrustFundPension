import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../../_shared/third-party/material.module';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-notifications-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './notifications-details.component.html',
  styleUrls: ['./notifications-details.component.css']
})
export class NotificationsDetailsComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NotificationsDetailsComponent>,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }


  closeDialog() {
    this.dialogRef.close();
  }

}
