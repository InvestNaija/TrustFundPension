import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../../_shared/third-party/material.module';
import { FormErrors, ValidationMessages } from './branch-locator.validators';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '@app/_shared/services/common/common.service';
import { ApplicationContextService } from '@app/_shared/services/common/application-context.service';
import { GMapService, Maps } from '@app/_shared/services/common/google-map.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommunicationsService } from '@app/_shared/services/api/communications.service';
import { Loader2Component } from '@app/_shared/ui/components/loader_2/loader.component';
import { SharedModule } from '@app/_shared/shared.module';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-branch-locator-details',
  standalone: true,
  imports: [ReactiveFormsModule, Loader2Component, CommonModule, SharedModule],
  templateUrl: './branch-locator-details.component.html',
  styleUrls: ['./branch-locator-details.component.css']
})
export class BranchLocatorDetailsComponent implements OnInit {
  @ViewChild('search') searchElementRef: ElementRef = {
    nativeElement: undefined,
  };
  container: any = { countdown: 20 };
  formErrors: any = FormErrors;
  uiErrors: any = FormErrors;
  validationMessages: any = ValidationMessages;
  addressForm!: FormGroup;
  submitting = false;
  errors: any = [];

  constructor(
    public commonService: CommonService,
    public appContext: ApplicationContextService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BranchLocatorDetailsComponent>,
    private gMapService: GMapService,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private commService: CommunicationsService,
    private toastr: ToastrService
  ) {
    let interval = setInterval(() => {
      this.container.countdown--;
      if (this.container['loadedMaps']) {
        clearInterval(interval);
        this.container.countdown = null;
      }
      if (this.container.countdown === 0) window.location.reload();
    }, 1000);
    this.gMapService.api.then((maps) => {
      this.initAutocomplete(maps);
      this.container['loadedMaps'] = true;
      this.renderer.setProperty(
        this.searchElementRef.nativeElement,
        'placeholder',
        'Search and pick your address here...'
      ); if (data)  this.getLocation();
    });


    this.addressForm = this.fb.group({
      name: [this.data?.name, [Validators.required]],
      email: [this.data?.email, [Validators.required, Validators.pattern(this.commonService.email)],],
      phone: [this.data?.phone, [Validators.required]],
      address: ['', [Validators.required]],
    });
  }

  ngOnInit() {

  }

  getLocation() {
    if (this.data.id) {
      let coords: any = {
        lat: this.data.latitude,
        lng: this.data.longitude,
      };


      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: coords }, (results: any, status: any) => {
        if (status == google.maps.GeocoderStatus.OK) {
          this.container.address = this.gMapService.getAddresses(
            results?.find(
              (a: any) => a.types.includes('street_address') && !a.plus_code
            )?.address_components
          );
          this.addressForm.patchValue({
            address:this.container?.address?.number || " " + " " + this.container?.address?.address1 + " " + this.container.address.address2 + " " + this.container?.address?.state?.name
          });
        }
      });
    }
  }

  submit() {
    this.submitting = true;
    if (this.addressForm.invalid) {
      this.uiErrors = JSON.parse(JSON.stringify(this.formErrors));
      this.errors = this.commonService.findInvalidControlsRecursive(
        this.addressForm
      );
      this.displayErrors();
      this.submitting = false;
      return;
    }

    const fd = JSON.parse(JSON.stringify(this.addressForm.value));
    // (fd.houseNo = this.container?.address?.number),
      (fd.fullAddress = this.container?.address?.number + " " + this.container?.address?.address1 + " " + this.container?.address?.address2 + " " + this.container?.address?.state?.name),
      // (fd.address2 = this.container?.address?.address2),
      // (fd.city = this.container?.address?.city),
      // (fd.lga = this.container?.address?.lga),
      // (fd.state = this.container?.address?.state?.code),
      // (fd.country = this.container?.address?.country?.code),
      (fd.longitude = this.container?.address?.geometry?.lng),
      (fd.latitude = this.container?.address?.geometry?.lat),
      (fd.phone = String(fd.phone)),
      delete fd.address;
    //  delete fd.phone;
    //  console.log(fd); return

   (this.data?.id ? this.commService.updateBranchLocator(fd, this.data.id) : this.commService.addBranchLocator(fd))
    .subscribe(
      (response: any) => {
        this.submitting = false;
        //  this.authService.email$.next(fd.email);
        // this.commonService.snackBar(
        //   this.commonService?.snackbarIcon?.success,
        //   'Branch added successfully',
        //   'success'
        // );
         this.toastr.success("Branch added successfully");
        this.dialogRef.close();
      },
      (errResp: any) => {
        this.submitting = false;
        let errorMessage = '';
        errorMessage = errResp?.error?.message;

        // this.commonService.snackBar(
        //   this.commonService?.snackbarIcon?.error,
        //   errorMessage,
        //   'error'
        // );
          this.toastr.error(errorMessage);
      }
    );
  }


  initAutocomplete(maps: Maps) {
    const autocomplete = new maps.places.Autocomplete(
      this.searchElementRef.nativeElement
    );
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.container.address = this.gMapService.getAddresses(
        place?.address_components
      );
      this.container.address = {
        ...this.container.address,
        geometry: {
          lng: place?.geometry?.location?.lng(),
          lat: place?.geometry?.location?.lat(),
        },
      };
    });
  }


  controlChanged(ctrlName: string) {
    this.errors = this.commonService.controlnvalid(
      this.addressForm.get(ctrlName) as FormControl
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
