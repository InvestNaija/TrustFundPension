import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../../_shared/third-party/material.module';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FundManagementDetailsComponent } from '../../details/fund-management-details/fund-management-details.component';


@Component({
  selector: 'app-view-fund-management',
  standalone: true,
       imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './view-fund-management.component.html',
  styleUrls: ['./view-fund-management.component.css']
})
export class ViewFundManagementComponent implements OnInit {

  constructor(
    public dialog: MatDialog
) { }

  ngOnInit() {
  }

  openFundManagementDialog(data?: any): void {
    const fundManagementDialog = this.dialog.open(FundManagementDetailsComponent, {
      data: {

      },
      width: '450px',
      disableClose: true,
    });


    //
    fundManagementDialog.afterClosed().subscribe((result: any) => {

      // callBack();
    });
  }

}
