import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../../_shared/third-party/material.module';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-faqs-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './faqs-details.component.html',
  styleUrls: ['./faqs-details.component.css']
})
export class FaqsDetailsComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FaqsDetailsComponent>,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }


  closeDialog() {
    this.dialogRef.close();
  }

}
