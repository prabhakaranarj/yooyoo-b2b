import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DateRangePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { AccumulationChart, AccumulationChartComponent } from '@syncfusion/ej2-angular-charts';
import {
  EditService,
  EditSettingsModel,
  ExcelExportService,
  FilterService,
  FilterSettingsModel,
  GridComponent,
  PageService,
  PageSettingsModel,
  SearchSettingsModel,
  SortService,
  ToolbarService
} from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { AuthService } from '../../../core/auth/auth.service';
import { UtilService } from '../../../shared/services/util.service';
import { SchoolService } from '../../school/school.service';
import { ReportService } from '../report.service';

@Component({
  selector: 'yoo-school-report',
  templateUrl: './school-report.component.html',
  styleUrls: ['./school-report.component.css'],
  providers: [
    ToolbarService,
    ExcelExportService,
    SortService,
    PageService,
    FilterService,
    EditService
  ],
  encapsulation: ViewEncapsulation.None
})
export class SchoolReportComponent implements OnInit {
  schoolData: any;
  school = [];
  urole: any;
  schoolId: any;
  @ViewChild('range') DateRange: DateRangePickerComponent;
  value: any;
  @ViewChild('grid1') public grid1: GridComponent;
  editparams: { params: { popupHeight: string } };
  users = [];
  editSettings: EditSettingsModel;
  pageSettings: PageSettingsModel;
  initialSort: Object;
  searchSettings: SearchSettingsModel;
  filterOptions: FilterSettingsModel;
  line = 'Both';
  questions = [];
  toolbar: Array<string>;

  @ViewChild('pie1') pie1: AccumulationChartComponent | AccumulationChart;
  // custom code end
  public startAngle = 0;
  public endAngle = 360;
  public radius = 'r';
  public enableAnimation = true;
  public enableSmartLabels = true;
  public tooltip: Object = {
    enable: true
  };
  // Initializing Legend
  public legendSettings: Object = {
    visible: true,
    position: 'Bottom'
  };
  public chartArea: Object = {
    border: {
      width: 0
    }
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
  public marker: Object = {
    dataLabel: {
      visible: true,
      position: 'Top',
      font: {
        fontWeight: '600', color: '#ffffff'
      }
    }
  };
  public primaryXAxis: Object = {
    valueType: 'Category',
    interval: 1,
    majorGridLines: { width: 0 }
  };
  public primaryYAxis: Object = {
    labelFormat: '{value}',
    edgeLabelPlacement: 'Shift',
    majorGridLines: { width: 0 },
    majorTickLines: { width: 0 },
    lineStyle: { width: 0 },
    labelStyle: {
      color: 'transparent'
    }
  };
  // custom code start
  public width: String = '100%';
  fromDate: any;
  toDate: any;
  schoolAssignmentData = [];
  schoolAttedanceData = [];
  schoolFeesData = [];
  chartData = [];
  schoolValue: any;
  rangeValue: any;
  constructor(
    private utilService: UtilService,
    private reportServices: ReportService,
    private schoolService: SchoolService,
    private authService: AuthService
  ) { }
  ngOnInit(): void {
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    this.fromDate = this.utilService.getFormattedDate1(startDate);
    this.toDate = this.utilService.getFormattedDate();
    this.rangeValue = [new Date(startDate), new Date()];
    this.pageSettings = { pageSize: 15 };
    this.toolbar = ['ExcelExport'];
    this.authService.getuRole()
      .subscribe(res => (this.urole = res));
    this.schoolId = JSON.parse(localStorage.getItem('userInfo')).schoolInfo.id;
    this.schoolService.getSchools()
      .subscribe(res => {
        this.schoolData = res;
        this.schoolValue = res.filter(data => data.id === this.schoolId)[0]['name'];
      });
    this.value = [new Date('1/1/2019'), new Date('2/1/2020')];
  }

  onToolbarClick(args: ClickEventArgs): void {
    if (args.item['properties'].text === 'Excel Export') {
      this.grid1.excelExport();
    }
  }
  onChangeSchool(e): void {
    this.schoolId = e.itemData.id;
    this.generateData();
  }
  onChangeDate(e): void {
    this.rangeValue = this.DateRange.value;
    this.fromDate = this.utilService.getFormattedDate1(this.rangeValue[0]);
    this.toDate = this.utilService.getFormattedDate1(this.rangeValue[1]);
    this.generateData();
  }
  generateData(): void {
  this.school = [];
  this.reportServices.getReportBySchool(this.schoolId, this.fromDate, this.toDate)
    .subscribe(res => {
      this.school.push(res);
      const noOfQuestionFaced = res.noOfQuestionFaced ? res.noOfQuestionFaced : 0;
      const noOfCorrectAnswers = res.noOfCorrectAnswers ? res.noOfCorrectAnswers : 0;
      const noOfTopicsAssigned = res.noOfTopicsAssigned ? res.noOfTopicsAssigned : 0;
      const noOfVideosWatched = res.noOfVideosWatched ? res.noOfVideosWatched : 0;
      const noOfWorksheetAppeared = res.noOfWorksheetAppeared ? res.noOfWorksheetAppeared : 0;
      const attendanceTakenDays = res.attendanceTakenDays ? res.attendanceTakenDays : 0;
      const presentDays = res.presentDays ? res.presentDays : 0;
      const totalTutionFee = res.totalTutionFee ? res.totalTutionFee : 0;
      const totalTutionFeepaid = res.totalTutionFeepaid ? res.totalTutionFeepaid : 0;
      const totalTransportFee = res.totalTransportFee ? res.totalTransportFee : 0;
      const totalTransportFeePaid = res.totalTransportFeePaid ? res.totalTransportFeePaid : 0;
      this.schoolAssignmentData = [{ x: 'Quizzes Attented', y: noOfQuestionFaced, r: noOfQuestionFaced },
                                   { x: 'Topics Learnt', y: noOfVideosWatched, r: noOfVideosWatched },
                                   { x: 'WorkSheets Practiced', y: noOfWorksheetAppeared, r: noOfWorksheetAppeared }];
      this.schoolAttedanceData = [{ x: 'Total No of Days', y: attendanceTakenDays, r: attendanceTakenDays },
                                  { x: 'Total No of Present Days', y: presentDays, r: presentDays }];
      this.schoolFeesData = [{ x: 'Tution Fee', y: totalTutionFee, r: totalTutionFee },
                             { x: 'Tution Fee Paid', y: totalTutionFeepaid, r: totalTutionFeepaid },
                             { x: 'Transportation Fee', y: totalTransportFee, r: totalTransportFee },
                             { x: 'Transport Fee Paid', y: totalTransportFeePaid, r: totalTransportFeePaid }];

      this.chartData = [
        { x: 'Topics Assigned', y: noOfTopicsAssigned },
        { x: 'Topics Learnt', y: noOfVideosWatched },
        { x: 'Quizzes Attented', y: noOfQuestionFaced },
        { x: 'Correct Answers', y: noOfCorrectAnswers },
        { x: 'WorkSheets Practiced', y: noOfWorksheetAppeared }];
      this.grid1.refresh();
    });
    }
}
