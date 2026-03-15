import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData = {
    email: '',
    password: ''
  };

  constructor() { }

  ngOnInit(): void {
  }

  onLogin() {
    console.log('Login attempt:', this.loginData);
  }
}
