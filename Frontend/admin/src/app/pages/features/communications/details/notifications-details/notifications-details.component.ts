import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormErrors, ValidationMessages } from './notifications.validators';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonService } from '@app/_shared/services/common/common.service';
import { ApplicationContextService } from '@app/_shared/services/common/application-context.service';
import { CommunicationsService } from '@app/_shared/services/api/communications.service';
import { ToastrService } from 'ngx-toastr';
import { Loader2Component } from '@app/_shared/ui/components/loader_2/loader.component';
import { SharedModule } from '@app/_shared/shared.module';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-notifications-details',
  standalone: true,
  imports: [ReactiveFormsModule, Loader2Component, SharedModule, EditorModule, CommonModule],
  templateUrl: './notifications-details.component.html',
  styleUrls: ['./notifications-details.component.css'],
})
export class NotificationsDetailsComponent implements OnInit {
  formErrors: any = FormErrors;
  uiErrors: any = FormErrors;
  validationMessages: any = ValidationMessages;
  notifyForm!: FormGroup;
  submitting = false;
  errors: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NotificationsDetailsComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private commService: CommunicationsService,
    private toastr: ToastrService,
    public commonService: CommonService,
    public appContext: ApplicationContextService
  ) {
    this.notifyForm = this.fb.group({
      title: [this.data.title, [Validators.required]],
      body: [this.data.body, [Validators.required]],
      type: ['SYSTEM']
    });
  }

  ngOnInit() {}

  submit() {
    this.submitting = true;
    if (this.notifyForm.invalid) {
      this.uiErrors = JSON.parse(JSON.stringify(this.formErrors));
      this.errors = this.commonService.findInvalidControlsRecursive(
        this.notifyForm
      );
      this.displayErrors();
      this.submitting = false;
      return;
    }

    const fd = JSON.parse(JSON.stringify(this.notifyForm.value));

    (this.data?.id
      ? this.commService.updateNotification(fd, this.data.id)
      : this.commService.addNotification(fd)
    ).subscribe(
      (response: any) => {
        this.submitting = false;
        this.toastr.success('Notification added successfully');
        this.dialogRef.close();
      },
      (errResp: any) => {
        this.submitting = false;
        let errorMessage = '';
        errorMessage = errResp?.error?.message;
        this.toastr.error(errorMessage);
      }
    );
  }

  controlChanged(ctrlName: string) {
    this.errors = this.commonService.controlnvalid(
      this.notifyForm.get(ctrlName) as FormControl
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

  closeDialog() {
    this.dialogRef.close();
  }
}
