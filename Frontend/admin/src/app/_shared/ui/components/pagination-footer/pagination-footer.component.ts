import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { SharedModule } from '@app/_shared/shared.module';

@Component({
  selector: 'app-pagination-footer',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './pagination-footer.component.html',
  styleUrl: './pagination-footer.component.scss',
})
export class PaginationFooterComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 50;
  dropdownOpen: boolean = false;
  @Output() pageChange = new EventEmitter<number>();
  itemsPerPageOptions: number[] = [5, 10, 50];
  @Input() selectedItemsPerPage: number = 10;
  @Output() selectedItems = new EventEmitter<number>();

  constructor(private elementRef: ElementRef) {}

  onPageChange(pageNumber: number) {
    this.pageChange.emit(pageNumber);
  }

  onSelectedItemsPerPageChange(numberPerPage: number) {
    this.selectedItems.emit(numberPerPage);
  }

  updateItemsPerPage(option: number) {
    this.selectedItemsPerPage = option;
    this.dropdownOpen = false;
    this.currentPage = 1; // Reset current page when changing items per page
    this.onSelectedItemsPerPageChange(option);
  }

  handleToggle() {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.listenForOutsideClicks();
    }
  }

  listenForOutsideClicks() {
    setTimeout(() => {
      document.addEventListener('click', this.onClickOutsideDropdown);
    });
  }

  onClickOutsideDropdown = (event: MouseEvent) => {
    if (!this.dropdownOpen) return;
    const target = event.target as HTMLElement;
    const dropdown = this.elementRef.nativeElement.querySelector('.dropdown');
    if (dropdown && !dropdown.contains(target)) {
      this.dropdownOpen = false;
      // document.removeEventListener('click', this.onClickOutsideDropdown);
    }
  };

  calculateNumBoxes(): number {
    return Math.ceil(this.totalPages / this.selectedItemsPerPage);
  }

  setCurrentPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.onPageChange(pageNumber);
  }
  nextPage() {
    const numPages = this.calculateNumBoxes();
    if (this.currentPage < numPages) {
      this.currentPage++;
      this.onPageChange(this.currentPage);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.onPageChange(this.currentPage);
    }
  }

  calculateStartIndex(): number {
    return (this.currentPage - 1) * this.selectedItemsPerPage + 1;
  }

  calculateEndIndex(): number {
    const endIndex = this.currentPage * this.selectedItemsPerPage;
    return endIndex > this.totalPages ? this.totalPages : endIndex;
  }
  generateBoxesArray(): any {
    const numBoxes = this.calculateNumBoxes();
    const newNumBoxes = this.pagination(this.currentPage, numBoxes);
    return newNumBoxes;
    // return Array.from({ length: numBoxes }, (_, index) => index + 1);
  }

  pagination(c: any, m: any) {
    var numberOfPageShown;
    let browserWidth = window?.innerWidth;
    if (browserWidth < 991) {
      numberOfPageShown = 0;
    } else {
      numberOfPageShown = 1;
    }
    var currentPage = c,
      lastPage = m,
      leftSide = currentPage - numberOfPageShown,
      rightSide = currentPage + numberOfPageShown + 1,
      range = [],
      rangeWithDots = [],
      l;

    for (let i = 1; i <= lastPage; i++) {
      if (i == 1 || i == lastPage || (i >= leftSide && i < rightSide)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  }
}
