import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DialogEditEventArgs,
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
  ToolbarService
} from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { apiUrl, thumbnailUrl } from '../../../core/api';
import { CurriculumService } from '../curriculum.service';
import { ToastService } from './../../../shared/services/toast.service';

@Component({
  selector: 'yoo-worksheet',
  templateUrl: './worksheet.component.html',
  styleUrls: ['./worksheet.component.css'],
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
export class WorksheetComponent implements OnInit {
  @ViewChild('worksheetForm') public worksheetForm: FormGroup;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('element') element;
  @ViewChild('Dialog') Dialog: DialogComponent;
  public worksheetFormData: FormData = new FormData();
  requestType: string;
  editparams: { params: { popupHeight: string } };
  users: any;
  thumbnailUrl = thumbnailUrl;
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
  worksheetData = {};
  isValid: Boolean = true;
  dialogContent: string;
  errorMsg: String = '';
  successMsg: String = '';
  apiUrl: string;
  imagePath: any;
  imgURL: string | ArrayBuffer;
  enterPress: boolean;
  constructor(
    private curriculumService: CurriculumService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.apiUrl = apiUrl;
    this.pageSettings = { pageSize: 10 };
    this.toolbar = ['Edit', 'Search'];
    this.searchSettings = {};
    this.filterOptions = { type: 'CheckBox' };
    this.editSettings = {
      allowEditing: true,
      allowAdding: false,
      mode: 'Dialog'
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
  dialogClose(): void {
    this.dialogContent = '';
  }

  openWorksheet(link): void {
    if (link) {
      this.dialogContent = `<iframe  src=\'${link}\' frameborder=\'0\' allow=\'autoplay; encrypted-media\' allowfullscreen=\'\'></iframe>`;
    } else {
      this.dialogContent = `<h2>WorkSheet Not Available!</h2>`;
    }
    this.Dialog.show(true);
  }
  // onFileChange(event, id): any {
  //   this.errorMsg = '';
  //   this.successMsg = '';
  //   this.isValid = true;
  //   const fileList: FileList = event.target.files;
  //   if (fileList.length === 0) {
  //     return;
  //   }

  //   const mimeType = fileList[0].type;
  //   if (mimeType.match(/image\/*/) === undefined) {
  //     // this.message = 'Only images are supported.';
  //     return;
  //   }

  //   if (fileList.length > 0) {
  //     const file: File = fileList[0];
  //     if (
  //       file.type === 'image/gif' ||
  //       file.type === 'image/png' ||
  //       file.type === 'image/jpeg'
  //     ) {
  //       if (file.size > 500000) {
  //         this.isValid = false;
  //         this.errorMsg = 'Media file size should be >500kb.';
  //       } else {
  //         this.isValid = true;
  //       }
  //     }
  //     const reader = new FileReader();
  //     this.imagePath = fileList;
  //     reader.readAsDataURL(fileList[0]);
  //     reader.onload = _event => {
  //       this.imgURL = reader.result;
  //     };
  //     this.worksheetFormData.append('media', file, file.name);
  //     // if (this.isValid) {
  //     //   this.worksheetFormData.append('media', file, file.name);
  //     //   this.curriculumService
  //     //     .uploadWorksheet(id, this.worksheetFormData)
  //     //     .subscribe(res => {
  //     //       this.successMsg = 'Uploaded successfully!';
  //     //     });
  //     // }
  //   }
  // }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.requestType = args.requestType;
      this.worksheetData = { ...args.rowData };
    }
    if (args.requestType === 'beginEdit') {
    }
    if (args.requestType === 'save') {
      this.updateworksheet(this.worksheetData);
      args.cancel = false;
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
  preventDefault(): void {
    this.enterPress = true;
  }
  cancel(): void {
    this.grid.closeEdit();
  }
  onSubmit(): void {
    this.grid.endEdit();
  }

  updateworksheet(formData): void {
    this.curriculumService.updateTopic(formData)
      .subscribe(res => {
        this.toast.success(res.message);
        this.reload();
      });
  }
  reload(): void {
    this.curriculumService.getAllTopics()
      .subscribe(res => {
        this.topics = res;
      });
  }
}
