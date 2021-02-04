import { Component } from '@angular/core';
import { ToastService } from './../services/toast.service';
import { ToasterContainerComponent } from 'angular2-toaster';

@Component({
  selector: 'yoo-toaster',
  template: `
  <toaster-container [toasterconfig]="config"></toaster-container>
  `
})

export class ToastComponent {
  constructor(private _toastService: ToastService) { }

  config = this._toastService.config;

}
