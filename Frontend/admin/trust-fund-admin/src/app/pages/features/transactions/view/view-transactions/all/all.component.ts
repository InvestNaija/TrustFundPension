import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MaterialModule } from '../../../../../../_shared/third-party/material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TransactionsHistoryComponent } from '../../../details/transactions-history/transactions-history.component';

@Component({
  selector: 'app-all',
  standalone: true,
    imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit {

  constructor(
        public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

    openTransactionsHistoryDialog(data?: any): void {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.position = {
        right: '0',
        top: '0' // Optional, to align it to the top right corner
      };
      const transactionsHistoryDialog = this.dialog.open(TransactionsHistoryComponent, {
        data: {},
        width: '450px',
        disableClose: true,
        position: {
          right: '10px',
          bottom: '0' // Optional, to align it to the top right corner
        }
      });


      //
      transactionsHistoryDialog.afterClosed().subscribe((result: any) => {

        // callBack();
      });
    }


}
