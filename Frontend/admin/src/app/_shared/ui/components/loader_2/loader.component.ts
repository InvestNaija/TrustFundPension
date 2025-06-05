import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '@app/_shared/third-party/material.module';

@Component({
  selector: 'app-loader2',
  standalone: true,
    imports: [MaterialModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class Loader2Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
