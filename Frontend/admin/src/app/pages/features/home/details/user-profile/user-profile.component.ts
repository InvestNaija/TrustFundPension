import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MaterialModule } from '../../../../../_shared/third-party/material.module';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { forkJoin } from 'rxjs';
import { HomeService } from '@app/_shared/services/api/home.service';
import { LoaderComponent } from '@app/_shared/ui/components/loader/loader.component';
import { Loader2Component } from '@app/_shared/ui/components/loader_2/loader.component';
import { CommonService } from '@app/_shared/services/common/common.service';
import { FormErrors, ValidationMessages } from './user-profile.validators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    LoaderComponent,
    Loader2Component,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  tab: string = 'personal';
  editPersonal: boolean = false;
  editContact: boolean = false;
  editOthers: boolean = false;
  editEmployer: boolean = false;
  editManager: boolean = false;

  personalForm!: FormGroup;
  contactForm!: FormGroup;
  othersForm!: FormGroup;
  employerForm!: FormGroup;
  managerForm!: FormGroup;

  errors: any = [];
  formErrors: any = FormErrors;
  uiErrors: any = FormErrors;
  validationMessages: any = ValidationMessages;

  pensionDetails: any;
  employersDetails: any;
  nokDetails: any;
  mediaDetails: any;
  bvnData: any;

  isLoading: boolean = false;
  submitLoading: boolean = false;

  passport!: string;
  signature!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UserProfileComponent>,
    public dialog: MatDialog,
    public fb: FormBuilder,
    private homeService: HomeService,
    public commonService: CommonService,
    private toastr: ToastrService
  ) {
    this.personalForm = this.fb.group({
      pen: ['', [Validators.required]],
      bvn: ['', [Validators.required]],
      nin: ['', [Validators.required]],
    });

    this.contactForm = this.fb.group({
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      next_of_kin_relationship: ['', [Validators.required]],
      next_of_kin_phone: ['', [Validators.required]],
    });

    this.othersForm = this.fb.group({
      accountType: ['', [Validators.required]],
    });

    this.employerForm = this.fb.group({
      name: ['', [Validators.required]],
      natureOfBusiness: ['', [Validators.required]],
      rcNumber: ['', [Validators.required]],
      initialDate: ['', [Validators.required]],
    });

    this.managerForm = this.fb.group({
      AGENT_NAME: ['', [Validators.required]],
      AGENT_PHONE: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.isLoading = true;

    this.othersForm.patchValue({
      accountType: this.data?.accountType,
    });

    if (this.data?.pen) {
      this.homeService
        .getPensionDetails(this.data?.id)
        .subscribe((getPensionDetails) => {
          this.pensionDetails = (getPensionDetails as { data: any })?.data;
          this.managerForm.patchValue({
            AGENT_NAME: this.pensionDetails[0]?.AGENT_NAME,
            AGENT_PHONE: this.pensionDetails[0]?.AGENT_PHONE,
          });
        });
    }

    forkJoin({
      getEmployersDetails: this.homeService.getEmployerDetails(this.data?.id),
      getNOKDetails: this.homeService.getNOKDetails(this.data?.id),
      getMediaDetails: this.homeService.getMediaDetails(this.data?.id),
      getBVNData: this.homeService.getBVN(this.data?.id),
    }).subscribe(
      ({ getEmployersDetails, getNOKDetails, getMediaDetails, getBVNData }) => {
        this.nokDetails = getNOKDetails as { data: any };
        this.mediaDetails = (getMediaDetails as { data: any })?.data;
        this.employersDetails = getEmployersDetails;
        this.bvnData = getBVNData as { data: any };

        this.personalForm.patchValue({
          pen: this.data?.pen,
          bvn: this.data?.bvn,
          nin: this.data?.nin,
        });

        this.contactForm.patchValue({
          email: this.data?.email,
          phone: this.data?.phone,
          // address:  this.bvnData?.bvnResponse?.residential_address,
          next_of_kin_relationship: this.nokDetails?.relationship,
          next_of_kin_phone: this.nokDetails?.phone,
        });

        this.employerForm.patchValue({
          name: this.employersDetails?.name,
          natureOfBusiness: this.employersDetails?.natureOfBusiness,
          rcNumber: this.employersDetails?.rcNumber,
          initialDate: this.employersDetails?.initialDate,
        });

        if (this.mediaDetails) {
          this.mediaDetails?.forEach((mediaData: any) => {
            if (
              (mediaData?.upload_type).toLowerCase() ===
              'passport_photo'.toLowerCase()
            ) {
              this.passport = mediaData?.file_url;
            } else if (
              (mediaData?.upload_type).toLowerCase() ===
              'signature'.toLowerCase()
            ) {
              this.signature = mediaData?.file_url;
            }
          });
        }

        this.isLoading = false;
      }
    );
  }

  getMediaFile(fileType: string): any {
    if (this.mediaDetails) {
      this.mediaDetails?.forEach((mediaData: any) => {
        if ((mediaData?.upload_type).toLowerCase() === fileType.toLowerCase()) {
          // console.log(mediaData?.file_url);
          return mediaData?.file_url;
        }
      });
    }
  }

  updateUser = () => {
    this.submitLoading = true;
    if (this.personalForm.invalid) {
      this.uiErrors = JSON.parse(JSON.stringify(this.formErrors));
      this.errors = this.commonService.findInvalidControlsRecursive(
        this.personalForm
      );
      this.displayErrors();
      this.submitLoading = false;
      return;
    }
    const fd = JSON.parse(JSON.stringify(this.personalForm.value));
    this.homeService.updateUser({ id: this.data?.id, ...fd }).subscribe(
      (response: any) => {
        this.toastr.success('Updated Successfully');
        this.submitLoading = false;
      },
      (errResp: any) => {
        this.submitLoading = false;
        let errorMessage = '';
        errorMessage = errResp?.error?.message;
        this.toastr.error(errorMessage);
      }
    );
  }

  sendForApproval = () => {
    this.submitLoading = true;
    this.homeService.SendToTrustFund({ id: this.data?.id }).subscribe(
      (response: any) => {
        this.toastr.success('Sent to trustfund Successfully');
        this.submitLoading = false;
        this.closeDialog();
      },
      (errResp: any) => {
        this.submitLoading = false;
        let errorMessage = '';
        errorMessage = errResp?.error?.message;
        this.toastr.error(errorMessage);
      }
    );
  };

  controlChanged(form: FormGroup, ctrlName: string) {
    this.errors = this.commonService.controlnvalid(
      form.get(ctrlName) as FormControl
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
