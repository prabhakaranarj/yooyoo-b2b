import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  DialogEditEventArgs,
  EditService,
  EditSettingsModel,
  ExcelExportService,
  FilterService,
  FilterSettingsModel,
  GridComponent,
  IEditCell,
  PageService,
  PageSettingsModel,
  SaveEventArgs,
  SearchSettingsModel,
  SelectionSettingsModel,
  SortService,
  TextWrapSettingsModel,
  ToolbarService
} from '@syncfusion/ej2-angular-grids';
import { FormGroup } from '@angular/forms';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
// tslint:disable-next-line:no-implicit-dependencies
import { ToastService } from 'src/app/shared/services/toast.service';
import { FeesService } from './fees.service';
import { SchoolService } from '../school/school.service';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'yoo-users',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.css'],
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
export class FeesComponent implements OnInit {
  urole: any;
  schoolData: any;
  feesObj = {};
  [x: string]: any;
  @ViewChild('userForm') public userForm: FormGroup;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('element') element;
  @ViewChild('Dialog') Dialog: DialogComponent;
  schoolId = '';
  requestType: string;
  userData = {};
  editparams: { params: { popupHeight: string } };
  editSettings: EditSettingsModel;
  pageSettings: PageSettingsModel;
  initialSort: Object;
  searchSettings: SearchSettingsModel;
  filterOptions: FilterSettingsModel;
  selectionOptions: SelectionSettingsModel;
  line = 'Both';
  public wrapSettings: TextWrapSettingsModel;
  public header: String = 'Upload Student';
  public showCloseIcon: Boolean = true;
  public width: String = '300px';
  public position: object = { X: 'center', Y: 'center' };
  public numericParams: IEditCell;
  toolbar: Array<string>;
  fees = [];
  constructor(
    private toast: ToastService,
    private feesService: FeesService,
    private authService: AuthService,
    private schoolService: SchoolService
  ) { }
  ngOnInit(): void {
    this.wrapSettings = { wrapMode: 'Both' };
    this.pageSettings = { pageSize: 15 };
    this.numericParams = { params: { decimals: 2 } };
    this.toolbar = ['Edit', 'Update', 'Cancel', 'Search', 'ExcelExport'];
    this.searchSettings = {};
    this.filterOptions = { type: 'CheckBox' };
    this.editSettings = {
      allowEditing: true,
      allowAdding: false,
      mode: 'Normal'
    };
    this.selectionOptions = { mode: 'Both' };
    this.editparams = { params: { popupHeight: '800px' } };
    this.initialSort = { columns: [{ field: '', direction: 'Ascending' }] };
    this.schoolId = JSON.parse(localStorage.getItem('userInfo')).schoolInfo.id;
    this.authService.getuRole()
      .subscribe(res => (this.urole = res));
    this.schoolService.getSchools()
      .subscribe(res => {
        this.schoolData = res;
      });
    this.reload();
  }
  onChangeSchool(e): void {
    this.schoolId = e.itemData.id;
    this.reload();
  }
  onToolbarClick(args: ClickEventArgs): void {
    if (args.item['properties'].text === 'PDF Export') {
      this.grid.pdfExport();
    } else if (args.item['properties'].text === 'Excel Export') {
      this.grid.excelExport();
    } else if (args.item['properties'].text === 'Import') {
      this.Dialog.show();
    }
  }

  actionBegin(args: any): void {
  }

  actionComplete(args: any): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.requestType = args.requestType;
    }
    if (args.requestType === 'save') {
      this.feesObj = {
        id: args.rowData['id'],
        studentName: args.rowData['studentName'],
        studentId: args.rowData['studentId'],
        tutionFee: args.rowData['tutionFee'],
        transportationFee: args.rowData['transportationFee'],
        paidTutionFee: args.rowData['paidTutionFee'],
        paidTransportFee: args.rowData['paidTransportFee'],
        schoolId: args.rowData['schoolId'],
        gradeName: args.rowData['gradeName']
      };
      this.addFees();
    }
  }

  addFees(): void {
    this.feesService.addFees(this.feesObj)
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
      this.feesService.viewFees(this.schoolId)
        .subscribe(res => (this.fees = res));
    }
}
