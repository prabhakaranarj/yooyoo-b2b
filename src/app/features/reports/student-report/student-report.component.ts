import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DateRangePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { AccumulationChart, AccumulationChartComponent, ChartComponent } from '@syncfusion/ej2-angular-charts';
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
import { SelectEventArgs } from '@syncfusion/ej2-angular-lists';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { AuthService } from '../../../core/auth/auth.service';
import { UtilService } from '../../../shared/services/util.service';
import { SchoolService } from '../../school/school.service';
import { UserService } from '../../users/user.service';
import { ReportService } from '../report.service';

@Component({
  selector: 'yoo-student-report',
  templateUrl: './student-report.component.html',
  styleUrls: ['./student-report.component.css'],
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
export class StudentReportComponent implements OnInit {
  student = [];
  schoolData: any;
  school: any;
  urole: any;
  schoolId: any;
  fromDate: any;
  toDate: any;
  schoolValue: any;
  attendanceUKG = [];
  attendanceLKG = [];
  attendanceNursery = [];
  attendanceData = [];
  assignmentData = [];
  feesdata = [];
  feesReport = [];
  attendanceReport: any;
  assignmentReport: any;
  studentAssignmentData = [];
  studentFeesData = [];
  studentAttedanceData = [];
  tempUsers: any;
  constructor(
    private userService: UserService,
    private reportService: ReportService,
    private schoolService: SchoolService,
    private utilService: UtilService,
    private authService: AuthService) { }

  @ViewChild('range') DateRange: DateRangePickerComponent;
  rangeValue: any;
  @ViewChild('grid') public grid: GridComponent;
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
  quizs = [];
  topics = [];
  FilterData = ['Attendance', 'Fees', 'Assignment'];
  gradeData = ['NURSERY', 'L.K.G', 'U.K.G'];
  filterValue = 'Assignment';
  @ViewChild('pie1') pie1: AccumulationChartComponent | AccumulationChart;
  @ViewChild('pie2') pie2: AccumulationChartComponent | AccumulationChart;
  @ViewChild('pie3') pie3: AccumulationChartComponent | AccumulationChart;
  @ViewChild('chart') chart: ChartComponent;
  // custom code end
  public startAngle = 0;
  public endAngle = 360;
  public radius = 'r';
  public enableAnimation = true;
  public enableSmartLabels = true;
  public tooltip: Object = {
    enable: true
  };
  public title = 'Attendance Details';
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

  public primaryXAxis: Object = {
    valueType: 'Category', interval: 1, majorGridLines: { width: 0 }
  };
  public primaryYAxis: Object = {
    majorGridLines: { width: 1 },
    width: 5
  };
  public palette = ['#e7128a', '#055e77', '#357cd2', '#00bdae'];
  public marker: Object = { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } };

  // custom code start
  public width: String = '100%';

  ngOnInit(): void {
    this.pageSettings = { pageSize: 15 };
    this.toolbar = [];
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    this.fromDate = this.utilService.getFormattedDate1(startDate);
    this.toDate = this.utilService.getFormattedDate();
    this.rangeValue = [new Date(startDate), new Date()];
    this.authService.getuRole()
      .subscribe(res => (this.urole = res));
    this.schoolId = JSON.parse(localStorage.getItem('userInfo')).schoolInfo.id;
    this.schoolService.getSchools()
      .subscribe(res => {
        this.schoolData = res;
        this.schoolValue = res.filter(data => data.id === this.schoolId)[0]['name'];
      });
    this.reload();
    this.generateData();
  }

  onToolbarClick(args: ClickEventArgs): void {
    if (args.item['properties'].text === 'Excel Export') {
      this.grid.excelExport();
    }
  }
  onSearch(type, e): void {
    this.users = this.tempUsers;
    const filterUsers = this.users.filter(
      item => item[`${type}`].toLowerCase()
        .indexOf(e.toLowerCase()) > -1);
    this.users = filterUsers;
  }
  onChangeSchool(e): void {
    this.schoolId = e.itemData.id;
    this.userService.getAllStudents(e.itemData.id)
      .subscribe(res => {
        res.filter(user => (user.color = this.randomColorChange()));
        this.users = res;
      });
    this.generateData();
  }
  onChangeDate(e): void {
    this.rangeValue = this.DateRange.value;
    this.fromDate = this.utilService.getFormattedDate1(this.rangeValue[0]);
    this.toDate = this.utilService.getFormattedDate1(this.rangeValue[1]);
    this.generateData();
  }

  onFilterType(e): void {
    this.filterValue = e.itemData.value;
    this.generateData();
  }

  generateData(): void {
    switch (this.filterValue) {
      case 'Assignment':
        this.reportService.getassignmentreportbyschool(this.schoolId, this.fromDate, this.toDate)
          .subscribe(res => {
            this.assignmentReport = res.assignmentReport;
            const assignmentData = res.assignmentReport;
            this.assignmentData.push([
              { x: 'LKG', y: assignmentData[0].noOfCorrectAnswers },
              { x: 'UKG', y: assignmentData[1].noOfCorrectAnswers },
              { x: 'NURSERY', y: assignmentData[2].noOfCorrectAnswers }
            ]);
            this.assignmentData.push([
              { x: 'LKG', y: assignmentData[0].noOfQuestionsAppeared },
              { x: 'UKG', y: assignmentData[1].noOfQuestionsAppeared },
              { x: 'NURSERY', y: assignmentData[2].noOfQuestionsAppeared }
            ]);
            this.assignmentData.push([
              { x: 'LKG', y: assignmentData[0].noOfVideosViewed },
              { x: 'UKG', y: assignmentData[1].noOfVideosViewed },
              { x: 'NURSERY', y: assignmentData[2].noOfVideosViewed }
            ]);
            this.assignmentData.push([
              { x: 'LKG', y: assignmentData[0].noOfWorkSheetAppeared },
              { x: 'UKG', y: assignmentData[1].noOfWorkSheetAppeared },
              { x: 'NURSERY', y: assignmentData[2].noOfWorkSheetAppeared }
            ]);
          });
        break;
      case 'Fees':
        this.reportService.getfeereportbyschool(this.schoolId, this.fromDate, this.toDate)
          .subscribe(res => {
            this.feesReport = res.feesReport;
            const feesData = res.feesReport;
            if (feesData) {
              this.feesdata.push([
                { x: 'NURSERY', y: feesData[0].totalTransportFee },
                { x: 'LKG', y: feesData[1].totalTransportFee },
                { x: 'UKG', y: feesData[2].totalTransportFee }
              ]);
              this.feesdata.push([
                { x: 'NURSERY', y: feesData[0].totalTransportFeePaid },
                { x: 'LKG', y: feesData[1].totalTransportFeePaid },
                { x: 'UKG', y: feesData[2].totalTransportFeePaid }
              ]);
              this.feesdata.push([
                { x: 'NURSERY', y: feesData[0].totalTutionFee },
                { x: 'LKG', y: feesData[1].totalTutionFee },
                { x: 'UKG', y: feesData[2].totalTutionFee }
              ]);
              this.feesdata.push([
                { x: 'NURSERY', y: feesData[0].totalTutionFeepaid },
                { x: 'LKG', y: feesData[1].totalTutionFeepaid },
                { x: 'UKG', y: feesData[2].totalTutionFeepaid }
              ]);
            }
          });
        break;
      case 'Attendance':
        this.reportService.getattnreportbyschool(this.schoolId, this.fromDate, this.toDate)
          .subscribe(res => {
            this.createAttendanceChart(res.attendaneReport);
          });
        break;
      default:
      // code block
    }
  }
  createAttendanceChart(data): void {
    this.attendanceData = data;
    this.attendanceUKG = [{ x: 'Total No of Days', y: data[0].totalAttendance, r: data[0].totalAttendance },
    { x: 'Total No of Present Days', y: data[0].totalPresentDays, r: data[0].totalPresentDays }];
    this.attendanceLKG = [{ x: 'Total No of Days', y: data[1].totalAttendance, r: data[1].totalAttendance },
    { x: 'Total No of Present Days', y: data[1].totalPresentDays, r: data[1].totalPresentDays }];
    this.attendanceNursery = [{ x: 'Total No of Days', y: data[2].totalAttendance, r: data[2].totalAttendance },
    { x: 'Total No of Present Days', y: data[2].totalPresentDays, r: data[2].totalPresentDays }];

  }

  onActionComplete(args: SelectEventArgs): void {
    this.student = [];
    this.userService.getReportByStudent(args.data['id'])
      .subscribe(res => {
        this.student.push(res);
        this.studentAssignmentData = [{ x: 'Quizzes Attented', y: res.noOfQuestionsFaced, r: res.noOfQuestionsFaced },
        { x: 'Topics Learnt', y: res.noOfVideoWatched, r: res.noOfVideoWatched },
        { x: 'WorkSheets Practiced', y: res.noOfWorkSheetAppeared, r: res.noOfWorkSheetAppeared }];
        this.studentAttedanceData = [{ x: 'Total No of Days', y: res.attendanceTakenDays, r: res.attendanceTakenDays },
        { x: 'Total No of Present Days', y: res.presentDays, r: res.presentDays }];
        this.studentFeesData = [{ x: 'Tution Fee', y: res.tutionFee, r: res.tutionFee },
        { x: 'Tution Fee Paid', y: res.totalTutionFeePaid, r: res.totalTutionFeePaid },
        { x: 'Transportation Fee', y: res.transportationFee, r: res.transportationFee },
        { x: 'Transport Fee Paid', y: res.totalTransportFeePaid, r: res.totalTransportFeePaid }];
      });
  }

  getShortName(fullName): void {
    // tslint:disable-next-line:newline-per-chained-call
    return fullName
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('');
  }
  randomColorChange(): any {
    const allowed = '0369cf'.split('');
    let s = '#';
    while (s.length < 4) {
      s += allowed.splice(Math.floor(Math.random() * allowed.length), 1);
    }

    return s;
  }
  reload(): void {
    this.userService.getAllStudents(this.schoolId)
      .subscribe(res => {
        res.filter(user => (user.color = this.randomColorChange()));
        this.users = res;
        this.tempUsers = res;
      });
  }
}
