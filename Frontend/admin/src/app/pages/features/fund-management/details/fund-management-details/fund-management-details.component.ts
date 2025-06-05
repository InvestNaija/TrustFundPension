import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../_shared/third-party/material.module';

@Component({
  selector: 'app-fund-management-details',
    standalone: true,
      imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './fund-management-details.component.html',
  styleUrls: ['./fund-management-details.component.css']
})
export class FundManagementDetailsComponent implements OnInit {

  constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<FundManagementDetailsComponent>,
            public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }


}
