import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../../_shared/third-party/material.module';
@Component({
  selector: 'app-contact',
  standalone: true,
      imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
) { }

  ngOnInit() {
  }

}
