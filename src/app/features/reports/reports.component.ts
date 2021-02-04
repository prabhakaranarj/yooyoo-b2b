import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'yoo-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  tabIndex = 0;
  urole: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    this.authService.getuRole().subscribe(res => this.urole = res);
  }

  changeTab(event): any {
    this.tabIndex = event.index;
  }
}
