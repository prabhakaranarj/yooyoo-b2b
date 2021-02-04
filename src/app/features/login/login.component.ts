import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../shared/services/login.service';
import { ToastService } from './../../shared/services/toast.service';

@Component({
  selector: 'yoo-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  myRecaptcha: Boolean = false;
  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _toast: ToastService
  ) { }

  ngOnInit() { }
  onScriptLoad(): void {
  }

  onScriptError(): void {
  }
  onSubmit(f): void {
    if (f.valid) {
      this._loginService.userAuth(f.value)
        .subscribe(
          (data: any) => {
            localStorage.setItem('urole', data.role);
            localStorage.setItem('token', data.accessToken); // pass api access token parameter name here
            localStorage.setItem('userInfo', JSON.stringify(data.userInfo)); // store user info object here
            this._router.navigate(['/dashboard']);
            // this._toast.success('Logged in successfully!');
          },
          (err: HttpErrorResponse) => {
            this._toast.error('Incorrect Email ID or Password');
          }
        );
    } else {
      this._toast.error('Form is not valid!');
    }
  }
  resetPassword(email: HTMLInputElement): void {
    if (email.value) {
      this._loginService.resetPassword(email.value)
        .subscribe(
          (data: any) => {
            this._toast.success('Password send successfully to Email!');
          },
          (err: HttpErrorResponse) => {
            this._toast.error(err);
          }
        );
    } else {
      this._toast.error('Incorrect Email ID');
    }
  }
}
