import { Injectable } from '@angular/core';
import { ToasterConfig, ToasterService } from 'angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private _toasterService: ToasterService) {}

  config: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right',
    animation: 'fade',
    showCloseButton: true,
    tapToDismiss: false,
    mouseoverTimerStop: true,
    timeout: 3000,
    newestOnTop: true,
    titleClass: 'h4'
  });

  success(body): void {
    this._toasterService.pop({
      type: 'success',
      title: 'Success!',
      body
    });
  }
  error(body): void {
    this._toasterService.pop({
      type: 'error',
      title: 'Failed!',
      body
    });
  }
  info(body): void {
    this._toasterService.pop({
      type: 'info',
      title: 'Info!',
      body
    });
  }
  warning(body): void {
    this._toasterService.pop({
      type: 'warning',
      title: 'Warning!',
      body
    });
  }
}
