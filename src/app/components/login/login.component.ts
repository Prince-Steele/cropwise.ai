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

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void { }

  async onLogin(email: string, password: string) {
    this.errorMessage = '';

    if (email && password) {
      await this.authService.login(email);
      await this.router.navigateByUrl('/app/dashboard');
      return;
    }

    this.errorMessage = 'Enter both email and password to continue.';
  }
}
