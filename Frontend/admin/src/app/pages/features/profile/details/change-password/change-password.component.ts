import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../_shared/third-party/material.module';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrors, ValidationMessages } from './change-password.validators';
import { AuthService } from '@app/_shared/services/auth/auth.service';
import { CommonService } from '@app/_shared/services/common/common.service';
import { Loader2Component } from '@app/_shared/ui/components/loader_2/loader.component';
import { passwordMatchValidator } from '@app/_shared/core/validators/password-match.validator';
import { PasswordStrengthValidator } from '@app/_shared/core/validators/PasswordStrengthValidator';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule, Loader2Component],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  container: any = {};
  errors: any = [];
  formErrors: any = FormErrors;
  uiErrors: any = FormErrors;
  validationMessages: any = ValidationMessages;
  submitting: boolean = false;

  constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ChangePasswordComponent>,
            public dialog: MatDialog,
             private fb: FormBuilder,
               private authService: AuthService,
                    private commonService: CommonService,
  ) {
         this.passwordForm = this.fb.group({
          currentPassword: [
            '',
            [Validators.required],
          ],
          newPassword: ['',       Validators.required,
            Validators.minLength(8),
            PasswordStrengthValidator],
          confirmNewPassword: ['', [Validators.required]],
        },
        { validators: passwordMatchValidator }
      );
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  showEyes = () => {
    this.container['fieldTextType'] = !this.container['fieldTextType'];
  };

  onSubmit = () => {
    this.submitting = true;
    if (this.passwordForm.invalid) {
      this.uiErrors = JSON.parse(JSON.stringify(this.formErrors));
      this.errors = this.commonService.findInvalidControlsRecursive(
        this.passwordForm
      );
      this.displayErrors();
      this.submitting = false;
      return;
    }
    const fd = JSON.parse(JSON.stringify(this.passwordForm.value));
    this.authService.changePassword(fd).subscribe(
      (response: any) => {
            this.commonService.snackBar(
            this.commonService?.snackbarIcon?.success,
            response?.message,
            'success'
          );
      },
      (errResp: any) => {
        this.submitting = false;
        let errorMessage = '';
          errorMessage = errResp?.error?.message;
        this.commonService.snackBar(
          this.commonService?.snackbarIcon?.error,
          errorMessage,
          'error'
        );
      }
    );
  };

    controlChanged(ctrlName: string) {
      this.errors = this.commonService.controlnvalid(
        this.passwordForm.get(ctrlName) as FormControl
      );
      if (Object.keys(this.errors).length === 0) {
        this.errors[ctrlName] = {};
        this.uiErrors[ctrlName] = '';
      }
      this.displayErrors();
    }

    displayErrors() {
      Object.keys(this.formErrors).forEach((control) => {
        this.formErrors[control] = '';
      });
      Object.keys(this.errors).forEach((control: any) => {
        Object.keys(this.errors[control]).forEach((error: any) => {
          this.uiErrors[control] = this.validationMessages[control][error];
        });
      });
    }


}
