import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../../_shared/third-party/material.module';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-promotions-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './promotions-details.component.html',
  styleUrls: ['./promotions-details.component.css']
})
export class PromotionsDetailsComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PromotionsDetailsComponent>,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }


  closeDialog() {
    this.dialogRef.close();
  }

}
