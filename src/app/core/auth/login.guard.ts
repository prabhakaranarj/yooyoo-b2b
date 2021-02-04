import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _authService: AuthService
  ) {}
  canActivate(): boolean {
    if (!this._authService.isLoggedIn()) {
      return true;
    } else {
      this._router.navigate(['/dashboard']);

      return false;
    }
  }
}
