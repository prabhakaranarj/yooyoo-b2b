import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import {
  DialogEditEventArgs,
  EditService,
  EditSettingsModel,
  ExcelExportProperties,
  ExcelExportService,
  FilterService,
  FilterSettingsModel,
  GridComponent,
  PageService,
  PageSettingsModel,
  RowDataBoundEventArgs,
  SaveEventArgs,
  SearchSettingsModel,
  SortService,
  ToolbarService
} from '@syncfusion/ej2-angular-grids';
import { UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
// tslint:disable-next-line:no-implicit-dependencies
import { apiUrl } from 'src/app/core/api';
import { CurriculumService } from '../curriculum/curriculum.service';
import { SchoolService } from '../school/school.service';
import { AuthService } from './../../core/auth/auth.service';
import { ToastService } from './../../shared/services/toast.service';
import { UtilService } from './../../shared/services/util.service';
import { AssignmentService } from './assignment.service';

@Component({
  selector: 'yoo-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
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
export class AssignmentComponent implements OnInit {
  schoolData: any;
  @ViewChild('assignmentForm') public assignmentForm: FormGroup;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('element') element;
  @ViewChild('gender') gender: DropDownListComponent;
  @ViewChild('class') class: DropDownListComponent;
  @ViewChild('QuizDialog') QuizDialog: DialogComponent;
  @ViewChild('Dialog') Dialog: DialogComponent;
  @ViewChild('Dialog1') Dialog1: DialogComponent;
  @ViewChild('formUpload') public uploadObj: UploaderComponent;
  schoolId = '';
  requestType: string;
  assignmentData = {};
  credManagerData = {};
  editparams: { params: { popupHeight: string } };
  editSettings: EditSettingsModel;
  pageSettings: PageSettingsModel;
  initialSort: Object;
  searchSettings: SearchSettingsModel;
  filterOptions: FilterSettingsModel;
  line = 'Both';
  public formData: FormData = new FormData();
  public header: String = 'Upload Student';
  public showCloseIcon: Boolean = true;
  public width: String = '300px';
  public position: object = { X: 'center', Y: 'center' };
  public maxDate: Date = new Date();
  toolbar: Array<string>;
  schools: any;
  excelExportProperties: ExcelExportProperties;
  urole: any;
  showLoader = false;
  assignments = [];
  gradeData = ['NURSERY', 'L.K.G', 'U.K.G'];
  subjects = [];
  topicData: any;
  dialogContent: string;
  quizData = {};
  apiUrl: string;
  questions = [];
  selectedTopic = [];
  constructor(
    private assignmentService: AssignmentService,
    private toast: ToastService,
    private curriculumService: CurriculumService,
    private authService: AuthService,
    private utilService: UtilService,
    private schoolService: SchoolService
  ) { }
  ngOnInit(): void {
    this.pageSettings = { pageSize: 15 };
    this.toolbar = ['Add', 'Edit', 'Delete', 'Search'];
    this.searchSettings = {};
    this.filterOptions = { type: 'CheckBox' };
    this.editSettings = {
      allowEditing: true,
      allowDeleting: true,
      allowAdding: true,
      mode: 'Dialog'
    };
    this.excelExportProperties = {
      fileName: 'Users.xlsx'
    };
    this.apiUrl = apiUrl;
    this.initialSort = {};
    this.schoolId = JSON.parse(localStorage.getItem('userInfo')).schoolInfo.id;
    this.authService.getuRole()
      .subscribe(res => (this.urole = res));
    this.editparams = { params: { popupHeight: '600px' } };
    this.reload();
    this.curriculumService.getAllSubjects()
      .subscribe(res => {
        this.subjects = res;
      });
    this.schoolService.getSchools()
      .subscribe(res => {
        this.schoolData = res;
      });
  }
  rowDataBound(args: RowDataBoundEventArgs): void {
    if (args.data['deleted']) {
      args.row.classList.add('deleted');
    }
  }
  onToolbarClick(args: ClickEventArgs): void {
    if (args.item['properties'].text === 'Excel Export') {
      this.grid.excelExport(this.excelExportProperties);
    }
  }

  async actionBegin(args: SaveEventArgs): Promise<any> {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.requestType = args.requestType;
      this.assignmentData = { ...args.rowData };
      this.assignmentData['schoolId'] = args.rowData['school'].id;
      this.assignmentData['grade'] = args.rowData['grade'].name;
      this.assignmentData['subjectId'] = args.rowData['subject'].id;
      await this.assignmentService
        .getTopicsBySubject(args.rowData['subject'].id)
        .subscribe(res => {
          this.topicData = res;
          this.assignmentData['topicId'] = args.rowData['topic'].id;
        });
    } else if (args.requestType === 'delete') {
      if (confirm('Are you sure you want to delete ?')) {
        this.deleteAssignment(args.data[0].id);
      }
    }
    if (args.requestType === 'save') {
      if (this.assignmentForm.valid) {
        const date = this.utilService.getFormattedDate1(args.data['date']);
        const toDate = this.utilService.getFormattedDate1(args.data['toDate']);
        this.assignmentData['date'] = date;
        this.assignmentData['toDate'] = toDate;
        if (this.requestType === 'beginEdit') {
          this.editAssignment(this.assignmentData);
        } else if (this.requestType === 'add') {
          this.saveAssignment(this.assignmentData);
        }
      } else {
        args.cancel = true;
      }
    }
  }

  actionComplete(args: DialogEditEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      args.dialog.width = '600px';
      args.dialog.buttons[0]['controlParent'].btnObj[0].element.setAttribute(
        'class',
        'hidden'
      );
      args.dialog.buttons[1]['controlParent'].btnObj[1].element.setAttribute(
        'class',
        'hidden'
      );
    }
  }
  dialogClose(): void {
    this.dialogContent = '';
    this.selectedTopic = [];

  }
  onOpenDialog(link): void {
    if (link) {
      // tslint:disable-next-line:max-line-length
      this.dialogContent = `<iframe  src=\'https://player.vimeo.com/video/${link}\' frameborder=\'0\' allow=\'autoplay; encrypted-media\' webkitallowfullscreen=\'true\' mozallowfullscreen=\'true\' allowfullscreen=\'true\'></iframe>`;
    } else {
      this.dialogContent = `<h2>Video Not Available!</h2>`;
    }
    this.Dialog.show(true);
  }

  openWorksheet(link): void {
    this.Dialog.show(true);
    if (link) {
      this.dialogContent = `<iframe  src=\'${link}\' frameborder=\'0\' allow=\'autoplay; encrypted-media\' allowfullscreen=\'\'></iframe>`;
    } else {
      this.dialogContent = `<h2>WorkSheet Not Available!</h2>`;
    }
  }
  openQuizView(topic): void {
    this.selectedTopic = [];
    this.selectedTopic.push(topic.id);
    this.Dialog1.show(true);
  }
  cancel(): void {
    this.grid.closeEdit();
  }
  onSubmit(): void {
    this.grid.endEdit();
  }
  async onSubjectChange(event): Promise<any> {
    this.assignmentService
      .getTopicsBySubject(event.itemData.id)
      .subscribe(res => {
        this.topicData = res;
      });
  }
  editAssignment(formData): void {
    this.assignmentService.editAssignment(formData)
      .subscribe(res => {
        this.toast.success(res.message);
        this.reload();
      });
  }
  saveAssignment(formData): void {
    this.assignmentService.saveAssignment(formData)
      .subscribe(res => {
        this.toast.success(res.message);
        this.reload();
      });
  }
  deleteAssignment(id): void {
    this.assignmentService.deleteAssignment(id)
      .subscribe(res => {
        this.toast.success(res.message);
        this.reload();
      });
  }
  focusIn(target: HTMLElement): void {
    target.parentElement.classList.add('e-input-focus');
  }

  focusOut(target: HTMLElement): void {
    target.parentElement.classList.remove('e-input-focus');
  }
  reload(): void {
    this.assignmentService.getAllAssignments()
      .subscribe(res => {
        res.filter(data => {
          data.name = data.school.name;
          if (data['date']) {
            data.date = this.utilService.getFormattedDate1(data['date']);
          }
          if (data['toDate']) {
            data.toDate = this.utilService.getFormattedDate1(data['toDate']);
          }
        });
        this.assignments = res;
        this.showLoader = true;
      });
  }
}
