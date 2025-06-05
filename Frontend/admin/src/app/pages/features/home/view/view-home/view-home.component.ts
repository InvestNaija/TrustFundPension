import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../_shared/third-party/material.module';
import { AllComponent } from './all/all.component';
import { TransferredComponent } from "./transferred/transferred.component";
import { PendingComponent } from './pending/pending.component';
import { ApprovedComponent } from './approved/approved.component';
import { RejectedComponent } from './rejected/rejected.component';
import { PaginationFooterComponent } from '@app/_shared/ui/components/pagination-footer/pagination-footer.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';
import { HomeService } from '@app/_shared/services/api/home.service';
import { SharedModule } from '@app/_shared/shared.module';

@Component({
  selector: 'app-view-home',
  standalone: true,
   imports: [SharedModule, AllComponent, TransferredComponent, PendingComponent, ApprovedComponent, RejectedComponent, PaginationFooterComponent],
  templateUrl: './view-home.component.html',
  styleUrls: ['./view-home.component.css']
})
export class ViewHomeComponent implements OnInit {

  currentTab: string = 'all';

  totalItems: number = 0;
  currentPage = 1;
  itemsPerPage: number = 10;
  displayedItems: any[] = [];
  totalUser: any;

  isLoading: boolean = false;

  searchForm: FormGroup;
  filterFormFieldGroup: FormGroup;

  userListArray:any[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private homeService: HomeService
  ) {
    this.searchForm = this.fb.group({
      search: '',
      limit: 10,
    });
    this.filterFormFieldGroup = this.fb.group({
      employee_type: '',
      branch: '',
      department: '',
      grade: '',
      status: '',
    });
  }

  ngOnInit() {
    this.currentTab = (window.location.href).split('/')[6];

    this.searchForm.valueChanges
    .pipe(
      startWith(this.searchForm.value), // Emit the initial form values
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((values) => {
        this.isLoading = true; // Set isLoading to true before making the request
        return this.homeService.getAllUSers({
          ...values,
          page: this.currentPage,
        });
      })
    )
    .subscribe(
      (userData: any) => {
        this.totalUser = userData.data?.meta?.itemCount;
        this.userListArray = userData?.data?.data;
        this.currentPage = userData.data?.meta?.page;
        this.totalItems = userData.data?.meta?.itemCount;
        this.updateDisplayedItems();
        this.isLoading = false; // Set isLoading to false after the data is received
      },
      (error) => {
        // console.error('Error fetching employees', error);
        this.isLoading = false; // Ensure isLoading is set to false in case of an error
      }
    );

  }


  tabChange(tabName: string) {
      switch(tabName) {
        case 'all':
          this.currentTab = 'all';
          this.router.navigateByUrl('/app/home/view/all');
          break;
          case 'approved':
          this.currentTab = 'approved';
          this.router.navigateByUrl('/app/home/view/approved');
          break;
          case 'pending':
          this.currentTab = 'pending';
          this.router.navigateByUrl('/app/home/view/pending');
          break;
          case 'rejected':
          this.currentTab = 'rejected';
          this.router.navigateByUrl('/app/home/view/rejected');
          break;
          case 'transferred':
          this.currentTab = 'transferred';
          this.router.navigateByUrl('/app/home/view/transferred');
          break;
          default:
            this.currentTab = 'all';
            this.router.navigateByUrl('/app/home/view/all');
            break;
      }
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
    this.displayedItems = this.userListArray;
  }


}
