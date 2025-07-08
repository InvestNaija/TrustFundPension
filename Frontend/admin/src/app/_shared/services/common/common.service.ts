import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { environment } from '@environments/environment';
import { SnackBarComponent } from '@app/_shared/ui/dialogs/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  email =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  url =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  oneDigit = /\d/;
  onlyDigits = /[0-9]+$/;
  oneLowerCase = /[a-z]/;
  mutiple1000 = /^[1-9]+[0-9]*000$/;
  oneUpperCase = /[A-Z]/;
  specialChar = /[ !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/;
  phoneNumber = /^\d{11}$/;
  onlyString = /^[a-zA-Z ]+$/;
  snackbarIcon = {
    success: 'ri-checkbox-circle-fill',
    error: 'ri-close-circle-fill',
    info: 'ri-information-2-fill',
  };

  duration: number = 4000000;
  verticalPosition: MatSnackBarVerticalPosition | undefined = 'top'; // 'top' | 'bottom'
  horizontalPosition: MatSnackBarHorizontalPosition | undefined = 'end'; //'start' | 'center' | 'end' | 'left' | 'right'

  container: any = {};

  relationships: any = [
    {code: "husband", name: "Husband"},
    {code: "wife", name: "Wife"},
    {code: "son", name: "Son"},
    {code: "daughter", name: "Daughter"},
    {code: "brother", name: "Brother"},
    {code: "sister", name: "Sister"},
    {code: "parent", name: "Parent"},
    {code: "others", name: "Others"},
  ]


  constructor(private _snackBar: MatSnackBar, private http: HttpClient) {}

  getLOVs(endpoint: string, selectScope: string, container: any, options: any) {
    if (container[selectScope] == null) {
      container[options['loading']] = 'Loading, please wait...';
      this.http
        .get(endpoint)
        .pipe()
        .subscribe(
          (response: any) => {
            container[options['loading']] = null;
            container[selectScope] = response.data;
          },
          (err) => {
            container[options['loading']] = null;
          }
        );
    }
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  crossFieldValidation(
    controlName: string,
    matchingControlName: string,
    errorToCheck: string
  ) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      let error: any = {};
      error[errorToCheck] = true;

      if (matchingControl.errors && !matchingControl.errors[errorToCheck]) {
        return;
      }
      if (
        control.value !== matchingControl.value &&
        errorToCheck == 'mustMatch'
      ) {
        matchingControl.setErrors(error);
      } else if (
        control.value === matchingControl.value &&
        errorToCheck == 'mustNotMatch'
      ) {
        matchingControl.setErrors(error);
      } else if (control.value && errorToCheck == 'required') {
        matchingControl.setErrors(error);
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  regexValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | any => {
      if (!control.value) {
        return null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }

  findInvalidControlsRecursive(
    formToInvestigate: FormGroup | FormArray
  ): string[] {
    const invalidControls: any = {};
    const recursiveFunc = (form: FormGroup | FormArray) => {
      Object.keys(form.controls).forEach((field) => {
        const control = form.get(field);
        if (
          control?.invalid &&
          !(control instanceof FormArray) &&
          !(control instanceof FormGroup)
        ) {
          invalidControls[field] = control.errors;
        }
        if (control instanceof FormGroup) {
          recursiveFunc(control);
        } else if (control instanceof FormArray) {
          recursiveFunc(control);
        }
      });
    };
    recursiveFunc(formToInvestigate);
    return invalidControls;
  }

  controlnvalid(controlToInvestigate: FormControl | any): string[] | any {
    const invalidControls: any = {};
    if (controlToInvestigate?.invalid) {
      const controlName: any = Object.keys(
        controlToInvestigate.parent.controls
      ).find(
        (key) =>
          controlToInvestigate.parent.controls[key] === controlToInvestigate
      );
      invalidControls[controlName] = controlToInvestigate.errors;
    }
    return invalidControls;
  }

  displayErrors(
    formErrors: any,
    ValidationMessages: any,
    errors: any,
    uiErrors: any
  ) {
    Object.keys(formErrors).forEach((control) => {
      formErrors[control] = '';
    });
    Object.keys(errors).forEach((control) => {
      Object.keys(errors[control]).forEach((error) => {
        uiErrors[control] = ValidationMessages[control][error];
      });
    });
    return { formErrors: formErrors, uiErrors: uiErrors };
  }

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',');
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  }

  snackBar(icon: string, message: string, successOrError = 'success', duration?: number) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: duration || this.duration,
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      data: {
        message: message,
        icon: icon,
      },
      panelClass: [successOrError],
    });
  }

}
