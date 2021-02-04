import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DropDownListComponent,
  MultiSelectComponent
} from '@syncfusion/ej2-angular-dropdowns';
import {
  DialogEditEventArgs,
  EditService,
  EditSettingsModel,
  ExcelExportProperties,
  ExcelExportService,
  FilterService,
  FilterSettingsModel,
  GridComponent,
  IFilter,
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
import { apiUrl, thumbnailUrl } from '../../../core/api';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { UtilService } from '../../../shared/services/util.service';
import { CurriculumService } from '../curriculum.service';

@Component({
  selector: 'yoo-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css'],
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
export class TopicComponent implements OnInit {
  @ViewChild('curriculumForm') public curriculumForm: FormGroup;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('element') element;
  @ViewChild('subjectName') subjectName: DropDownListComponent;
  @ViewChild('categoryName') categoryName: MultiSelectComponent;
  public mediaFormData: FormData = new FormData();
  @ViewChild('Dialog') Dialog: DialogComponent;
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @ViewChild('formUpload') public uploadObj: UploaderComponent;
  schoolId = '';
  requestType: string;
  enterPress: boolean;
  thumbnailUrl = thumbnailUrl;
  curriculumData = {};
  credManagerData = {};
  editparams: { params: { popupHeight: string } };
  users: any;
  credManager: any;
  editSettings: EditSettingsModel;
  pageSettings: PageSettingsModel;
  initialSort: Object;
  searchSettings: SearchSettingsModel;
  filterOptions: FilterSettingsModel;
  filter: IFilter;
  line = 'Both';
  public subjectFormData: FormData = new FormData();
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
  subjects: any;
  categories: any;
  errorMsg: String = '';
  successMsg: String = '';
  isValid: Boolean = true;
  dialogContent: string;
  imagePath: FileList;
  imgURL: string | ArrayBuffer;
  apiUrl: string;
  constructor(
    private curriculumService: CurriculumService,
    private toast: ToastService,
    private utilService: UtilService,
    private authService: AuthService
  ) { }
  ngOnInit(): void {
    this.apiUrl = apiUrl;

    this.pageSettings = { pageSize: 10 };
    this.toolbar = ['Add', 'Edit', 'Delete', 'Search'];
    this.searchSettings = {};
    this.filterOptions = { type: 'CheckBox' };
    this.filter = {
      type: 'CheckBox'
    };
    this.editSettings = {
      allowEditing: true,
      allowDeleting: true,
      allowAdding: true,
      mode: 'Dialog'
    };

    this.initialSort = { columns: [{ field: '', direction: 'Ascending' }] };
    this.authService.getuRole()
      .subscribe(res => (this.urole = res));
    this.curriculumService.getAllSubjects()
      .subscribe(res => {
        this.subjects = res;
      });
    this.curriculumService.getAllCategories()
      .subscribe(res => {
        this.categories = res;
      });
    // this.Dialog.hide();
    this.reload();
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
  dialogClose(): void {
    this.dialogContent = '';
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

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.requestType = args.requestType;
      this.curriculumData = { ...args.rowData };
    } else if (args.requestType === 'delete') {
      if (confirm('Are you sure you want to delete ?')) {
        this.deleteTopic(args.data[0].id);
      }
    }
    if (args.requestType === 'beginEdit') {
      this.imgURL = `${apiUrl}/media/getthumbnaillink/${this.curriculumData['id']}`;
    }
    if (args.requestType === 'save') {
      if (this.curriculumForm.valid) {
        const cat = this.curriculumData['categoryName'];
        const categories = this.categories.filter(obj => cat.some(obj2 => {
          return obj.name === obj2;
        }));
        this.curriculumData['categories'] = categories;
        this.curriculumData['subjects'] = this.subjectName['itemData'];
        if (this.requestType === 'beginEdit') {
          this.updateTopic(this.curriculumData);
        } else if (this.requestType === 'add') {
          this.createTopic(this.curriculumData);
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

  cancel(): void {
    this.grid.closeEdit();
  }
  onSubmit(): void {
    this.grid.endEdit();
  }

  updateTopic(formData): void {
    this.curriculumService.updateTopic(formData)
      .subscribe(res => {
        this.toast.success(res.message);
        this.reload();
      });
  }
  createTopic(formData): void {
    this.curriculumService.createTopic(formData)
      .subscribe(res => {
        this.toast.success(res.message);
        this.reload();
      });
  }
  deleteTopic(id): void {
    this.curriculumService.deleteTopic(id)
      .subscribe(res => {
        this.toast.success(res.message);
        this.reload();
      });
  }
  preventDefault(): void {
    this.enterPress = true;
  }
  focusIn(target: HTMLElement): void {
    target.parentElement.classList.add('e-input-focus');
  }

  focusOut(target: HTMLElement): void {
    target.parentElement.classList.remove('e-input-focus');
  }
  reload(): any {
    this.curriculumService.getAllTopics()
      .subscribe(res => {
        this.users = res;
        res.filter(data => {
          // data.categoryName.push(Array.prototype.map.call(
          //   data.categories,
          //   s => s.name
          // )[0]);
          const categoryName = [];
          data.categories.filter(category => {
            categoryName.push(category.name);
          });
          data.categoryName = categoryName;
          if (data.subjects !== null) {
            data.subjectName = data.subjects.name;
          } else {
            data.subjectName = '';
          }
          return data;
        });
        this.showLoader = true;
      });
  }
}
