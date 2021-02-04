import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'yoo-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  fullName: string;
  email: string;
  mobile: string;
  location: string;

  constructor(
    private _utilService: UtilService,
    private _authService: AuthService
  ) {}

  ngOnInit() {
    if (this._authService.isLoggedIn()) {
      this.fullName = this._utilService.getUserInfo().fullName;
      this.email = this._utilService.getUserInfo().email;
      this.mobile = this._utilService.getUserInfo().mobile;
      this.location = this._utilService.getUserInfo().location;
    }
  }
}
