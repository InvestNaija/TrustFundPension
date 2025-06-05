import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../../_shared/third-party/material.module';
import { FaqsDetailsComponent } from '../../../details/faqs-details/faqs-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent implements OnInit {

  constructor(
        public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

   openFaqsDialog(data?: any): void {
       const faqsDialog = this.dialog.open(FaqsDetailsComponent, {
         data: {
          create: false
         },
         width: '450px',
         disableClose: true,
       });
       //
       faqsDialog.afterClosed().subscribe((result: any) => {

         // callBack();
       });
     }

}
