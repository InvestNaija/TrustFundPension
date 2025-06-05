import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../_shared/third-party/material.module';

@Component({
  selector: 'app-user-management-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './user-management-detail.component.html',
  styleUrls: ['./user-management-detail.component.css']
})
export class UserManagementDetailComponent implements OnInit {

  constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<UserManagementDetailComponent>,
            public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }


}
