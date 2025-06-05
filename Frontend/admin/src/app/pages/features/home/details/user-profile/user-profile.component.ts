import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../../_shared/third-party/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  tab: string = 'personal'
  editPersonal: boolean = false;
  editContact: boolean = false;
  editOthers: boolean = false;

   personalForm!: FormGroup;
   contactForm!: FormGroup;
   othersForm!: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UserProfileComponent>,
    public dialog: MatDialog,
    public fb: FormBuilder
  ) {
    this.personalForm = this.fb.group({
      pen: ['']
    });

    this.contactForm = this.fb.group({
      phone: [''],
      email: ['']
    });

    this.othersForm = this.fb.group({
      bvn: [''],
      nin: [''],
      accountType: ['']
    });
   }

  ngOnInit() {

    this.contactForm.patchValue({
      email: this.data?.email,
      phone: this.data?.phone,
    });

    this.othersForm.patchValue({
      bvn: this.data?.bvn,
      nin: this.data?.nin,
      accountType: this.data?.accountType,
    });
  }


  closeDialog() {
    this.dialogRef.close();
  }

}
