import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../_shared/third-party/material.module';
@Component({
  selector: 'app-fund-management',
  standalone: true,
    imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './fund-management.component.html',
  styleUrls: ['./fund-management.component.css']
})
export class FundManagementComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
