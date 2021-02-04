import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@angular/material';
import {
  EditService,
  EditSettingsModel,
  ExcelExportService,
  FilterService,
  FilterSettingsModel,
  GridComponent,
  PageService,
  PageSettingsModel,
  SaveEventArgs,
  SearchSettingsModel,
  SortService,
  TextWrapSettingsModel,
  ToolbarService
} from '@syncfusion/ej2-angular-grids';
import { Observable, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap
} from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/services/notification.service';
import { ToastService } from '../../shared/services/toast.service';
import { UtilService } from '../../shared/services/util.service';
import { SchoolService } from '../school/school.service';

@Component({
  selector: 'yoo-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  providers: [
    ToolbarService,
    ExcelExportService,
    SortService,
    PageService,
    FilterService,
    EditService
  ]
})
export class NotificationsComponent implements AfterViewInit, OnInit {
  urole: string;
  initialSort: Object;
  notificationForm = new FormGroup({
    schoolId: new FormControl(''),
    schoolName: new FormControl(''),
    gradeId: new FormControl(''),
    studentId: new FormControl(''),
    studentName: new FormControl(''),
    header: new FormControl(''),
    message: new FormControl('')
  });
  filteredSchools: Observable<any>;
  filteredStudents: Observable<any>;
  toolbar: Array<string>;

  classes = [{ name: 'ALL', id: 0 }, { name: 'NURSERY', id: 1 }, { name: 'L.K.G', id: 2 }, { name: 'U.K.G', id: 3 }];
  students = [];
  data = [];
  public wrapSettings: TextWrapSettingsModel;
  pageSettings: PageSettingsModel;
  public editSettings: EditSettingsModel;
  searchSettings: SearchSettingsModel;
  filterOptions: FilterSettingsModel;
  @ViewChild('f') notificationFormValues;
  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;
  @ViewChild('grid') public grid: GridComponent;
  subscription: Subscription;
  schoolId = '';
  notification: any;

  constructor(
    private _notificationService: NotificationService,
    private _toastService: ToastService,
    private _authService: AuthService,
    private _schoolService: SchoolService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.pageSettings = { pageSize: 15 };
    this.toolbar = ['Search', 'Delete'];
    this.initialSort = { columns: [{ field: 'date', direction: 'Descending' }] };
    this.editSettings = {
      allowEditing: false,
      allowAdding: false,
      allowDeleting: true,
      mode: 'Normal'
    };
    this.searchSettings = {};
    this.wrapSettings = { wrapMode: 'Both' };
    this.filterOptions = { type: 'CheckBox' };
    this._authService.getuRole()
      .subscribe(res => (this.urole = res));
    this.reload();
    if (this.urole !== 'SUPERADMIN') {
      this.schoolId = JSON.parse(
        localStorage.getItem('userInfo')
      ).schoolInfo.id;
      this.notificationForm.get('schoolId')
        .setValue(this.schoolId);
      this.schoolChange(this.schoolId);
    } else {
      this.disableClass();
    }
    this.disableStudent();
    // school auto complete
    this.filteredSchools = this.notificationForm
      .get('schoolName')
      .valueChanges
      .pipe(
        startWith(undefined),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(val => {
          return this.filterSchool(val || '');
        })
      );

    // student auto complete
    this.filteredStudents = this.notificationForm
      .get('studentName')
      .valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterStudent(val))
      );
  }

  ngAfterViewInit() {
    this._subscribeToClosingActions();
  }

  private _subscribeToClosingActions(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.trigger.panelClosingActions.subscribe(
      e => {
        if (!e || !e.source) {
          this.notificationForm.get('schoolId')
            .setValue(undefined);
          this.notificationForm.get('schoolName')
            .setValue(undefined);
          this.notificationForm.get('gradeId')
            .setValue(undefined);
          this.notificationForm.get('studentId')
            .setValue(undefined);
          this.notificationForm.get('studentName')
            .setValue(undefined);
          if (this.urole === 'SUPERADMIN') {
            this.disableClass();
          }
          this.disableStudent();
        }
      },
      err => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions()
    );
  }
  actionBegin(args: SaveEventArgs): any {
    if (args.requestType === 'delete') {
      this.deleteNotification(args.data[0].id);
    }
  }
  onChangeSchool(event: MatAutocompleteSelectedEvent): void {
    this.notificationForm.get('gradeId')
      .setValue(undefined);
    this.notificationForm.get('studentId')
      .setValue(undefined);
    this.notificationForm.get('studentName')
      .setValue(undefined);
    this.students = [];
    this.notificationForm.get('schoolName')
      .setValue(event.option.value);
    const schoolId = event.option.id;
    this.schoolChange(schoolId);
  }
  schoolChange(schoolId): any {
    this.notificationForm.get('schoolId')
      .setValue(schoolId);
    this._schoolService
      .getStudentsByClass(schoolId)
      .pipe(map(res => res))
      .subscribe(res => {
        // this.classes = [];
        this.data = res;
        if (this.classes.length === 0) {
          this._toastService.warning('No class record found');
          this.disableClass();
          this.disableStudent();
        } else {
          this.notificationForm.get('gradeId')
            .enable();
          }
        });
    this.notificationForm.get('gradeId')
      .enable();
  }
  onChangeClass(value): void {
    if (value) {
      this.notificationForm.get('studentId')
        .setValue(undefined);
      this.students = [];
      this.students = this.data.filter(val => val.id === value)[0].students;
      if (this.students.length === 0) {
        this._toastService.warning('No student record found');
        this.notificationForm.get('studentName')
          .disable();
      } else {
        this.notificationForm.get('studentName')
          .enable();
      }
    } else {
      this.notificationForm.get('studentName')
        .disable();
    }
  }

  onChangeStudent(event: MatAutocompleteSelectedEvent): void {
    this.notificationForm.get('studentId')
      .setValue(event.option.id);
    this.notificationForm.get('studentName')
      .setValue(event.option.value);
  }

  // school filter
  filterSchool(val: string): Observable<any> {
    return this._schoolService.getAllSchools()
      .pipe(
      map(response =>
        response.filter(option => {
          return (
            option.name.toLowerCase()
              .indexOf(val.toString()
              .toLowerCase()) === 0
          );
        })
      )
    );
  }
  deleteNotification(id): void {
    this._notificationService.deleteNotification(id)
      .subscribe(res => {
        this._toastService.success(res.message);
        this.reload();
      });
  }
  reload(): void {
    this._notificationService.getSchoolNotification()
      .subscribe(res => {
        this.notification = res.filter(data => {
          data.date = this.utilService.getFormattedDate1(data.created_at);
          return data;
        });
      });
  }
  // student filter
  filterStudent(val: string): any {
    return val
      ? this.students.filter(
        option =>
          option.firstName.toLowerCase()
            .indexOf(val.toLowerCase()) > -1
      )
      : this.students;
  }

  onFormSubmit(): any {

    const data = {
      schoolId: this.notificationForm.value.schoolId,
      schoolName: this.notificationForm.value.schoolName,
      gradeId: this.notificationForm.value.gradeId,
      studentId: this.notificationForm.value.studentId ? this.notificationForm.value.studentId : '',
      studentName: this.notificationForm.value.studentName ? this.notificationForm.value.studentName : '',
      header: this.notificationForm.value.header,
      message: this.notificationForm.value.message
    };
    this._notificationService
      .saveNotification(data)
      .subscribe(
        (res: any) => {
          this.notificationFormValues.resetForm();
          this.reload();
          this._toastService.success(
            'We have sent a notification successfully!'
          );
          if (this.urole === 'SUPERADMIN') {
            this.disableClass();
          } else {
            this.notificationForm.get('schoolId')
              .setValue(this.schoolId);
          }
          this.disableStudent();

        },
        (err: HttpErrorResponse) => {
          this._toastService.error('Something went wrong!');
        }
      );
  }

  disableClass(): any {
    // this.classes = [];
    this.notificationForm.get('gradeId')
      .disable();
  }
  disableStudent(): any {
    this.students = [];
    this.notificationForm.get('studentName')
      .disable();
  }
}
