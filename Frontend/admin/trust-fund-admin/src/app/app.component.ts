import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { SharedModule } from './_shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './_shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SharedModule],
  providers: [provideCharts(withDefaultRegisterables()), HttpClient, AuthService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'client';
  ngxEnv = import.meta.env['NG_APP_ENV'];
  supabaseUrl = import.meta.env.NG_APP_PUBLIC_SUPABASE_URL;
  supabaseKey = import.meta.env['NG_APP_PUBLIC_SUPABASE_ANON_KEY'];



  ngOnInit(): void {

  }
}
