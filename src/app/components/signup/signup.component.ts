import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void { }

  async onSignup(firstName: string, lastName: string, email: string, password: string, confirmPassword: string) {
    this.errorMessage = '';
    this.successMessage = '';

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      this.errorMessage = 'Fill out every field to create your account.';
      return;
    }

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isSubmitting = true;

    try {
      const displayName = `${firstName} ${lastName}`.trim();
      const result = await this.authService.signup(email, password, displayName);

      if (result.requiresEmailConfirmation) {
        this.successMessage = 'Account created. Check your email to confirm your address before logging in.';
        return;
      }

      await this.router.navigate(['/app/dashboard']);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to create your account right now.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
