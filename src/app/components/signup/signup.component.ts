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

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void { }

  async onSignup(firstName: string, lastName: string, email: string, password: string) {
    if (email && password) {
      const displayName = `${firstName} ${lastName}`.trim();
      await this.authService.login(email, displayName);
      await this.router.navigate(['/app/dashboard']);
    }
  }
}
