import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormErrors, ValidationMessages } from './login.validators';
import { CommonService } from '@app/_shared/services/common/common.service';
import { AuthService } from '@app/_shared/services/auth/auth.service';
import { SharedModule } from '@app/_shared/shared.module';
import { Loader2Component } from '@app/_shared/ui/components/loader_2/loader.component';
import { SnackBarComponent } from '@app/_shared/ui/dialogs/snack-bar/snack-bar.component';
import { ApplicationContextService } from '@app/_shared/services/common/application-context.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Loader2Component, SharedModule],

  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  container: any = {};
  errors: any = [];
  formErrors: any = FormErrors;
  uiErrors: any = FormErrors;
  validationMessages: any = ValidationMessages;
  submitting: boolean = false;

   constructor(
     private fb: FormBuilder,
     private commonService: CommonService,
     private authService: AuthService,
     private router: Router,
    private appContext: ApplicationContextService,
    private activatedRoute: ActivatedRoute
   ) { }

   ngOnInit() {
     this.loginForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.pattern(this.commonService.email)],
      ],
      password: ['', [Validators.required]],
    });
   }

   showEyes = () => {
    this.container['fieldTextType'] = !this.container['fieldTextType'];
  };

  onSubmit = () => {
    this.submitting = true;
    if (this.loginForm.invalid) {
      this.uiErrors = JSON.parse(JSON.stringify(this.formErrors));
      this.errors = this.commonService.findInvalidControlsRecursive(
        this.loginForm
      );
      this.displayErrors();
      this.submitting = false;
      return;
    }
    const fd = JSON.parse(JSON.stringify(this.loginForm.value));
    this.authService.login(fd).subscribe(
      (response: any) => {
          this.authService.setToken(response?.data?.tokens);
            this.appContext.userInformation$.next(response.data);
            this.commonService.snackBar(
            this.commonService?.snackbarIcon?.success,
            response?.message,
            'success'
          );

        if (
          this.authService.redirectUrl ||
          this.activatedRoute.snapshot.queryParamMap.get('redirectUrl')
        ) {
          this.router.navigate([
            this.authService.redirectUrl ||
              this.activatedRoute.snapshot.queryParamMap.get('redirectUrl'),
          ]);
          this.authService.redirectUrl = '';
        } else {
          this.router.navigate(['/app/home']);
        }
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
      this.loginForm.get(ctrlName) as FormControl
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
