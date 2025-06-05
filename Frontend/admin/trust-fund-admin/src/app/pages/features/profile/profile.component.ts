import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApplicationContextService } from '@app/_shared/services/common/application-context.service';
import { MaterialModule } from '@app/_shared/third-party/material.module';
import { Subscription } from 'rxjs';
import { ChangePasswordComponent } from './details/change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  standalone: true,
    imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userInformation: any;
  userSubscription$!: Subscription;
  userForm!: FormGroup;
  container: any = {};
  constructor(
    private appContext: ApplicationContextService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.userForm = this.fb.group({
      name: ['',],
      department: [''],
      role: [''],
      password: ['']
    });
  }


  ngOnInit() {
    this.userSubscription$ = this.appContext.getUserInformation().subscribe({
      next: (data: any) => {
        if (data) {
          this.userInformation = data;
          this.userForm.patchValue({
            name: data?.firstName + ' ' + data?.lastName,
            department: data?.department ?? "NIL",
            role: data?.role ?? "NIL",
            password: '************'
          });
        }
      },
    });
  }

    openChangePasswordDialog(data?: any): void {
      const changePasswordDialog = this.dialog.open(ChangePasswordComponent, {
        data: {},
        width: '450px',
        disableClose: true,
      });
      //
      changePasswordDialog.afterClosed().subscribe((result: any) => {

        // callBack();
      });
    }

}
