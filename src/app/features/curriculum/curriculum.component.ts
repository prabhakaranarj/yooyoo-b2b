import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'yoo-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css']
})

export class CurriculumComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router) { }
  tabIndex: any;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // tslint:disable-next-line:radix
    this.tabIndex = id ? parseInt(id) : 0;
  }
  changeTab(event): any {
    this.tabIndex = event.index;
    this.router.navigate(['/curriculum', { id: event.index }]);
  }
}
