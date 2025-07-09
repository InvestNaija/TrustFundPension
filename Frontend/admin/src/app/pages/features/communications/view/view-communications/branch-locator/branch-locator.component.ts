import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../../_shared/third-party/material.module';
import { BranchLocatorDetailsComponent } from '../../../details/branch-locator-details/branch-locator-details.component';
import { CommunicationsService } from '@app/_shared/services/api/communications.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';
import { PaginationFooterComponent } from '@app/_shared/ui/components/pagination-footer/pagination-footer.component';
import { LoaderComponent } from '@app/_shared/ui/components/loader/loader.component';

@Component({
  selector: 'app-branch-locator',
    standalone: true,
      imports: [CommonModule, RouterModule, MaterialModule, PaginationFooterComponent, LoaderComponent],
  templateUrl: './branch-locator.component.html',
  styleUrls: ['./branch-locator.component.css']
})
export class BranchLocatorComponent implements OnInit {

  @Input() updated: boolean = false;
  branchList:any[] = [];

  totalItems: number = 0;
  currentPage = 1;
  itemsPerPage: number = 5;
  displayedItems: any[] = [];
  totalUser: any;

  isLoading: boolean = true;

  searchForm: FormGroup;

  constructor(
         public dialog: MatDialog,
         private commService: CommunicationsService,
             private fb: FormBuilder,
   ) {
    this.searchForm = this.fb.group({
      search: '',
      limit: 5,
    });
    }

   ngOnInit() {
    this.getBranchLocator();
   }

    openBranchDialog(data?: any): void {
        const branchDialog = this.dialog.open(BranchLocatorDetailsComponent, {
          data: {
           create: false,
           ...data
          },
          width: '450px',
          disableClose: true,
        });
        //
        branchDialog.afterClosed().subscribe((result: any) => {
          this.getBranchLocator();
          // callBack();
        });
      }

         // branch locator



        getBranchLocator = () => {
              this.searchForm.valueChanges
              .pipe(
                startWith(this.searchForm.value), // Emit the initial form values
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((values) => {
                  this.isLoading = true; // Set isLoading to true before making the request
                  return this.commService.getBranchLocator({
                    ...values,
                    page: this.currentPage,
                  });
                })
              )
              .subscribe(
                (userData: any) => {
                  this.totalUser = userData.data?.meta?.total;
                  this.branchList = userData.data.branches;
                  this.currentPage = userData.data.meta?.page;
                  this.totalItems = userData.data.meta?.total;
                  this.updateDisplayedItems();
                  this.isLoading = false; // Set isLoading to false after the data is received
                },
                (error) => {
                  // console.error('Error fetching employees', error);
                  this.isLoading = false; // Ensure isLoading is set to false in case of an error
                }
              );
        }

        onPageChange(pageNumber: number): void {
          this.currentPage = pageNumber;
          this.updateDisplayedItems();
          this.searchForm.patchValue({ page: this.currentPage });
          // You can fetch data based on the page number here
        }

        updateSelectedItemsPerPage(itemsPerPage: number): void {
          this.itemsPerPage = itemsPerPage;
          this.searchForm.patchValue({ limit: this.itemsPerPage });

          this.updateDisplayedItems();
        }

        updateDisplayedItems() {
          this.displayedItems = this.branchList;
        }

           // branch locator

}
