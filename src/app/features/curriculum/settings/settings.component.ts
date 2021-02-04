import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
  ToolbarService,
  DialogEditEventArgs
} from '@syncfusion/ej2-angular-grids';
import { FormGroup } from '@angular/forms';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ToastService } from './../../../shared/services/toast.service';
import { CurriculumService } from '../curriculum.service';
import { apiUrl } from '../../../core/api';
@Component({
  selector: 'yoo-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
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
export class SettingsComponent implements OnInit {
  @ViewChild('credManagerForm') public credManagerForm: FormGroup;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('element') element;

  requestType: string;
  editparams: { params: { popupHeight: string } };
  users: any;
  editSettings: EditSettingsModel;
  editSettings1: EditSettingsModel;
  pageSettings: PageSettingsModel;
  initialSort: Object;
  searchSettings: SearchSettingsModel;
  filterOptions: FilterSettingsModel;
  line = 'Both';
  public subjectFormData: FormData = new FormData();
  @ViewChild('subjectForm') public subjectForm: FormGroup;
  subjectData = {};
  public header: String = 'Upload Student';
  public showCloseIcon: Boolean = true;
  public width: String = '300px';
  public position: object = { X: 'center', Y: 'center' };
  toolbar: Array<string>;
  toolbar1: Array<string>;
  subjects: any;
  categories: any;
  errorMsg: String = '';
  successMsg: String = '';
  isValid: boolean;
  imagePath: any;
  imgURL: string | ArrayBuffer;
  apiUrl: string;
  constructor(
    private curriculumService: CurriculumService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.apiUrl = apiUrl;
    this.pageSettings = { pageSize: 15 };
    this.toolbar = ['Add', 'Edit', 'Cancel', 'Search'];
    this.toolbar1 = ['Add', 'Update', 'Cancel', 'Search'];
    this.searchSettings = {};
    this.filterOptions = { type: 'CheckBox' };
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog'
    };
    this.editSettings1 = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Normal'
    };
    this.editparams = { params: { popupHeight: '800px' } };
    this.initialSort = { columns: [{ field: '', direction: 'Ascending' }] };

    this.reload();
  }

  onToolbarClick(args: ClickEventArgs): void {
    if (args.item['properties'].text === 'Excel Export') {
      this.grid.excelExport();
    }
  }
  cancel(): void {
    this.grid.closeEdit();
  }
  onSubmit(): void {
    this.grid.endEdit();
  }
  onFileChange(event, id): any {
    this.errorMsg = '';
    this.isValid = true;
    const fileList: FileList = event.target.files;
    if (fileList.length === 0) {
      return;
    }

    const mimeType = fileList[0].type;
    if (mimeType.match(/image\/*/) === undefined) {
      return;
    }

    if (fileList.length > 0) {
      const file: File = fileList[0];
      if (
        file.type === 'image/gif' ||
        file.type === 'image/png' ||
        file.type === 'image/jpeg'
      ) {
        if (file.size > 500000) {
          this.isValid = false;
          this.errorMsg = 'Media file size should be >500kb.';
        } else {
          this.isValid = true;
        }
      }
      const reader = new FileReader();
      this.imagePath = fileList;
      reader.readAsDataURL(fileList[0]);
      reader.onload = _event => {
        this.imgURL = reader.result;
      };
      if (this.isValid) {
        this.subjectFormData.append('media', file, file.name);
        this.curriculumService
          .uploadSubjectMedia(id, this.subjectFormData)
          .subscribe(res => {
            this.toast.success('Image Uploaded successfully!');
            this.subjectFormData = new FormData();
            // this.grid.endEdit();
            this.grid.closeEdit();
            // this.reload();

          });
      }
    }
  }
  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.requestType = args.requestType;
      this.subjectData = { ...args.rowData };
    } else if (args.requestType === 'delete') {
      if (confirm('Are you sure you want to delete ?')) {
        this.deleteSubjects(args.data[0].id);
      }
    }
    if (args.requestType === 'beginEdit') {
      this.imgURL = `${apiUrl}/media/getsubjectmedia/${this.subjectData['id']}`;
    }
    if (args.requestType === 'save') {
      if (this.requestType === 'add') {
        const data = {
          name: args.data['name']
        };
        this.createSubjects(data);
      } else {
        const data = {
          id: args.data['id'],
          name: args.data['name']
        };
        this.updateSubjects(data);
      }
    }
  }
  actionBegin2(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.requestType = args.requestType;
      this.subjectData = { ...args.rowData };
    }
    if (args.requestType === 'save') {
      if (this.requestType === 'add') {
        this.createCategories(args.data);
      } else {
        this.updateCategories(args.data);
      }
    }
  }
  actionComplete(args: DialogEditEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      args.dialog.width = '500px';
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
  updateSubjects(formData): void {
    this.curriculumService.updateSubjects(formData)
      .subscribe(res => {
        this.toast.success('Subject updated successfully!');
        this.reload();
      });
  }
  createSubjects(formData): void {
    this.curriculumService.createSubjects(formData)
      .subscribe(res => {
        this.toast.success('Subject created successfully!');
        this.reload();
      });
  }
  deleteSubjects(id): void {
    this.curriculumService.deleteSubjects(id)
      .subscribe(res => {
        this.toast.success('Subject deleted successfully!');
        this.reload();
      });
  }
  updateCategories(formData): void {
    this.curriculumService.updateCategories(formData)
      .subscribe(res => {
        this.toast.success('Successfuly Updated');
        this.reload();
      });
  }
  createCategories(formData): void {
    this.curriculumService.createCategories(formData)
      .subscribe(res => {
        this.toast.success(res);
        this.reload();
      });
  }
  deleteCategories(id): void {
    this.curriculumService.deleteCategories(id)
      .subscribe(res => {
        this.toast.success(res.message);
        this.reload();
      });
  }
  reload(): void {
    this.curriculumService.getAllSubjects()
      .subscribe(res => {
        this.subjects = res;
      });
    this.curriculumService.getAllCategories()
      .subscribe(res => {
        this.categories = res;
      });
  }
}
