import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../_shared/third-party/material.module';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-view-analytics',
  standalone: true,
     imports: [CommonModule, RouterModule, MaterialModule, BaseChartDirective],
  templateUrl: './view-analytics.component.html',
  styleUrls: ['./view-analytics.component.css']
})
export class ViewAnalyticsComponent implements OnInit {
public barChartLegend = true;
public barChartPlugins = [];

public barChartData: ChartConfiguration<'bar'>['data'] = {
  labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
  datasets: [
    { data: [ 65, 59, 80, 81, 56, 55, 40, 40, 60, 10, 40, 36 ], label: 'Male',  backgroundColor: '#19476A', },
    { data: [ 28, 48, 40, 19, 86, 27, 90, 60, 77, 23, 44, 42 ], label: 'Female', backgroundColor: '#00A3E3' }
  ]
};

public barChartOptions: ChartConfiguration<'bar'>['options'] = {
  responsive: true,
  plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
        boxWidth: 10,
        useBorderRadius: true,
        borderRadius: 4
        }
      }
  },
  scales: {
    x: {
        grid: {
          display: false,
        }
    },
    y: {
      grid: {
        display: false,
      }
  }
}
}

  constructor() { }

  ngOnInit() {
  }

}
