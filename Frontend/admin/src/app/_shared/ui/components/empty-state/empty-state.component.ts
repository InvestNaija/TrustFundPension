import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent implements OnInit {
 @Input('emptyState') emptyState: any;

  constructor() { }

  ngOnInit() {
  }

}
