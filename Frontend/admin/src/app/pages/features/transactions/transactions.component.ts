import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../_shared/third-party/material.module';

@Component({
  selector: 'app-transactions',
  standalone: true,
    imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
