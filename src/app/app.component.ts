import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  page = '';
  constructor(private route: Router, private titleService: Title) {
    route.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((n: NavigationEnd) => {
        const pageTitle =
          route.routerState.snapshot.root.children[0].data['title'];
        if (pageTitle) {
          this.page = pageTitle;
          this.titleService.setTitle(pageTitle);
        } else if (pageTitle !== false) {
          this.titleService.setTitle('fluin.io');
        }
      });
  }
}
