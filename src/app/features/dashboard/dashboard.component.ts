import { Component, OnInit, ViewChild } from '@angular/core';
import { AccumulationChart, AccumulationChartComponent } from '@syncfusion/ej2-angular-charts';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { ReportService } from '../reports/report.service';

@Component({
  selector: 'yoo-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('pie1') pie1: AccumulationChartComponent | AccumulationChart;
  urole: string;
  public tooltip: Object = {
    enable: true
  };
  // Initializing Legend
  public legendSettings: Object = {
    visible: true,
    position: 'Bottom'
  };
  // Initializing DataLabel
  public dataLabel: Object = {
    visible: true,
    name: 'text',
    position: 'Inside',
    font: {
      fontWeight: '600',
      color: '#ffffff'
    }
  };
  
  schoolId: any;
  assignmentData = [];
  constructor(private _authService: AuthService, private reportService: ReportService, private utilService: UtilService) { }

  ngOnInit() {
    this._authService.getuRole()
      .subscribe(
        res => this.urole = res
    );
    this.schoolId = JSON.parse(localStorage.getItem('userInfo')).schoolInfo.id;
    const startDate = this.utilService.getFormattedDate1(new Date(new Date().getFullYear(), 0, 1));
    const endDate = this.utilService.getFormattedDate1(new Date());
    this.reportService.getassignmentreportbyschool(this.schoolId, startDate, endDate)
      .subscribe(res => {
        const assignment = res.assignmentReport;
        this.assignmentData.push([
          { x: 'LKG', y: assignment[0].noOfQuestionsAppeared },
          { x: 'UKG', y: assignment[1].noOfQuestionsAppeared },
          { x: 'NURSERY', y: assignment[2].noOfQuestionsAppeared }
        ]);
        this.assignmentData.push([
          { x: 'LKG', y: assignment[0].noOfVideosViewed },
          { x: 'UKG', y: assignment[1].noOfVideosViewed },
          { x: 'NURSERY', y: assignment[2].noOfVideosViewed }
        ]);
        this.assignmentData.push([
          { x: 'LKG', y: assignment[0].noOfWorkSheetAppeared },
          { x: 'UKG', y: assignment[1].noOfWorkSheetAppeared },
          { x: 'NURSERY', y: assignment[2].noOfWorkSheetAppeared }
        ]);
      });
  }

}
