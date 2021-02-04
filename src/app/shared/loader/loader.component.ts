import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { Subscription } from 'rxjs';
import { LoaderState } from './loader.model';
import { LoaderService } from '../services/loader.service';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
@ViewChild('customSpinner') container: ElementRef;
  show = false;

  private subscription: Subscription;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.createLoader(this.container.nativeElement);
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
        if (this.show) {
          this.showLoader();
        } else {
          this.hideLoader();
         }
      });
  }
  createLoader(container) {
    createSpinner({
      target: container,
      width: '50px'

    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showLoader() {
    showSpinner(this.container.nativeElement);
    }
  hideLoader() {
    hideSpinner(this.container.nativeElement);
  }

}
