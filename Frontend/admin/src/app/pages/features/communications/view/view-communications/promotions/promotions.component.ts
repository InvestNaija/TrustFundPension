import { Component, OnInit } from '@angular/core';
import { PromotionsDetailsComponent } from '../../../details/promotions-details/promotions-details.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../../_shared/third-party/material.module';

@Component({
  selector: 'app-promotions',
  standalone: true,
    imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {

  constructor(
         public dialog: MatDialog,
   ) { }

   ngOnInit() {
   }

    openPromotionsDialog(data?: any): void {
        const promotionsDialog = this.dialog.open(PromotionsDetailsComponent, {
          data: {
           create: false
          },
          width: '450px',
          disableClose: true,
        });
        //
        promotionsDialog.afterClosed().subscribe((result: any) => {

          // callBack();
        });
      }

}
