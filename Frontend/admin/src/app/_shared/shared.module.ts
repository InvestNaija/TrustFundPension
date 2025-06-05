import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './third-party/material.module';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from '@app/_shared/core/providers/jwt.interceptor';
import { AuthGuard } from '@app/_shared/core/providers/auth.guard';
import { AutoLogoutService } from './services/common/auto-logout.service';
import { CommonService } from './services/common/common.service';
import { AuthService } from './services/auth/auth.service';
import { HomeService } from './services/api/home.service';
import { PaginationFooterComponent } from './ui/components/pagination-footer/pagination-footer.component';

@NgModule({
  declarations: [

  ],
  providers: [
    AutoLogoutService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    CommonService,
    AuthService,
    HttpClient,
    HomeService

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterOutlet,
    HttpClientModule,


  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    RouterOutlet
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
