import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastService } from './../../shared/services/toast.service';
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
  SelectionSettingsModel,
  SortService,
  ToolbarService
} from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { SchoolService } from './school.service';

@Component({
  selector: 'yoo-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css'],
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
export class SchoolComponent implements OnInit {
  enterPress: any;
  constructor(
    private schoolService: SchoolService,
    private toast: ToastService
  ) { }
  requestType: string;
  schoolData = {};
  @ViewChild('schoolForm') public schoolForm: FormGroup;
  editparams: { params: { popupHeight: string } };
  schools: any;
  public editSettings: EditSettingsModel;
  pageSettings: PageSettingsModel;
  toolbar: Array<string>;
  initialSort: Object;
  public selectionOptions: SelectionSettingsModel;
  searchSettings: SearchSettingsModel;
  filterOptions: FilterSettingsModel;
  showLoader = false;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('element') element;
  @ViewChild('gender') gender: DropDownListComponent;
  line = 'Both';
  key: Object = {};
  public genderDdl: Array<string> = ['Male', 'Female', 'Others'];
  excelExportProperties: ExcelExportProperties;
  ngOnInit(): void {
    this.pageSettings = { pageSize: 15 };
    this.toolbar = ['Add', 'Edit', 'Delete', 'Search', 'ExcelExport'];
    this.searchSettings = {};
    this.filterOptions = { type: 'CheckBox' };
    this.selectionOptions = { type: 'Single' };
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog'
    };
    this.editparams = { params: { popupHeight: '600px' } };
    this.initialSort = { columns: [{ field: '', direction: 'Ascending' }] };
    this.excelExportProperties = {
      fileName: 'School.xlsx'
    };
    this.reload();
  }

  rowDataBound(args: RowDataBoundEventArgs): void {
    if (args.data['active']) {
      args.row.classList.add('deleted');
    }
  }
  onToolbarClick(args: ClickEventArgs): void {
    if (args.item['properties'].text === 'PDF Export') {
      this.grid.pdfExport();
    } else if (args.item['properties'].text === 'Excel Export') {
      this.grid.excelExport();
    }
  }
  onRowSelected(e): void {
    const rowData = '';
    this.key = {
      selectedUser: e.data.name,
      values: rowData[0]
    };
  }

  actionBegin(args: SaveEventArgs): any {
    if (this.enterPress) {
      this.enterPress = false;
      args.cancel = true;
      return false;
    }
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.requestType = args.requestType;
      this.schoolData = { ...args.rowData };
    }
    if (args.requestType === 'save') {
      if (this.schoolForm.valid) {
        args.data = this.schoolData;
        if (this.requestType === 'beginEdit') {
          this.editSchoolData(args.data);
        } else if (this.requestType === 'add') {
          this.addSchoolData(args.data);
        }
      } else {
        args.cancel = true;
      }
    }

    if (args.requestType === 'delete') {
      this.deletSchoolData(args.data[0].id);
    }
  }

  actionComplete(args: DialogEditEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      args.dialog.width = '800px';
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
  editSchoolData(data): void {
    this.schoolService.updateSchool(data)
      .subscribe(res => {
        this.toast.success(res.message);
        this.reload();
      });
  }
  addSchoolData(data): void {
    this.schoolService.addSchool(data)
      .subscribe(res => {
        this.toast.success(res.message);
        this.reload();
      });
  }
  deletSchoolData(id): void {
    this.schoolService.deleteSchool(id)
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

  reload(): any {
    this.schoolService.getSchools()
      .subscribe(res => {
        this.schools = res;
        res.filter(data => data.deleted === '0' ? data.status = 'Active' : data.status = 'Inactive');
        this.showLoader = true;
      });
  }
}
