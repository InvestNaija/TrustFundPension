import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../_shared/third-party/material.module';
@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
