import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { SharedModule } from '@app/_shared/shared.module';

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
