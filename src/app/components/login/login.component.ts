import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void { }

  async onLogin(email: string, password: string) {
    this.errorMessage = '';

    if (!email || !password) {
      this.errorMessage = 'Enter both email and password to continue.';
      return;
    }

    this.isSubmitting = true;

    try {
      await this.authService.login(email, password);
      await this.router.navigateByUrl('/app/dashboard');
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to log in right now.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
