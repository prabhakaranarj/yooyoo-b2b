import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { UtilService } from '../services/util.service';
import { AuthService } from '../../core/auth/auth.service';
import { RaiseTicketService } from 'src/app/features/raise-a-ticket/raise-a-ticket.service';
@Component({
  selector: 'yoo-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  fullName: string;
  notifications: [];
  ticketCount: number;
  urole = '';
  enableAttendance = 0;
  enableFees = 0;
  enablePrintedWorksheet = 0;
  tickets = [];
  constructor(
    private _router: Router,
    private _toast: ToastService,
    private _utilService: UtilService,
    private _authService: AuthService,
    private ticketService: RaiseTicketService,
    private el: ElementRef, private renderer: Renderer
  ) { }

  ngOnInit() {
    if (this._authService.isLoggedIn()) {
      this.fullName = this._utilService.getUserInfo().fullName;
      this.enableAttendance = this._utilService.getUserInfo().schoolInfo.enableAttendance;
      this.enableFees = this._utilService.getUserInfo().schoolInfo.enableFees;
      this.enablePrintedWorksheet = this._utilService.getUserInfo().schoolInfo.enablePrintedWorksheet;
    }
    this._authService.getuRole()
      .subscribe(
        res => this.urole = res
      );
    this.ticketService.getTickets()
      .subscribe(res => {
      this.tickets = res.filter(data => data.resolution !== 3);
      this.ticketCount = this.tickets.length;
    });

  }
  onMenuClick(): void {
    this.renderer.setElementClass(this.el.nativeElement.querySelector('.navbar-custom'), 'in', false);
  }
  logOut(): void {
    this._utilService.removeToken();
    this._utilService.removeUserRole();
    this._utilService.removeUserInfo();
    this._router.navigate(['/login']);
    this._toast.success('Logged out successfully!');
  }
}
