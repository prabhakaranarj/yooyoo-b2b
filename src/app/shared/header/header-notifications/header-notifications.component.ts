import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'yoo-header-notifications',
  templateUrl: './header-notifications.component.html',
  styleUrls: ['./header-notifications.component.css']
})
export class HeaderNotificationsComponent implements OnInit {
  notifications: [];
  notificationCount: number;

  constructor(
    private _toast: ToastService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit() {
    // this._notificationService.getSchoolNotification().subscribe(
    //   (data: any) => {
    //     this.notifications = data;
    //     this.notificationCount = this.notifications.length;
    //   },
    //   (err: HttpErrorResponse) => {
    //     this._toast.error('Something went wrong');
    //   }
    // );
  }
}
