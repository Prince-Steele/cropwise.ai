import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  showPassword = false;
  showConfirmPassword = false;

  constructor(private router: Router) { }

  ngOnInit(): void { }

  onSignup(firstName: string, lastName: string, email: string, password: string) {
    console.log('Signup data:', { firstName, lastName, email, password });
    if (email && password) {
      this.router.navigate(['/app/dashboard']);
    }
  }
}
