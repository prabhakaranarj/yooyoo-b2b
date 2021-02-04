import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AutoCompleteComponent } from '@syncfusion/ej2-angular-dropdowns';
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
  SelectionSettingsModel,
  SortService,
  ToolbarService
} from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { SchoolService } from '../../school/school.service';
import { UserService } from '../user.service';
import { ToastService } from './../../../shared/services/toast.service';

@Component({
  selector: 'yoo-cred-manager',
  templateUrl: './cred-manager.component.html',
  styleUrls: ['./cred-manager.component.css'],
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
export class CredManagerComponent implements OnInit {
  @ViewChild('credManagerForm') public credManagerForm: FormGroup;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('element') element;
  @ViewChild('Dialog') Dialog: DialogComponent;
  @ViewChild('schoolName') schoolObj: AutoCompleteComponent;
  schoolId = '';
  requestType: string;
  credManagerData = {};
  editparams: { params: { popupHeight: string } };
  users: any;
  credManager: any;
  editSettings: EditSettingsModel;
  pageSettings: PageSettingsModel;
  initialSort: Object;
  searchSettings: SearchSettingsModel;
  filterOptions: FilterSettingsModel;
  selectionOptions: SelectionSettingsModel;
  line = 'Both';
  public formData: FormData = new FormData();
  public header: String = 'Upload Student';
  public showCloseIcon: Boolean = true;
  public width: String = '300px';
  public position: object = { X: 'center', Y: 'center' };
  toolbar: Array<string>;
  schools: any;
  enterPress: any;
  constructor(
    private userService: UserService,
    private toast: ToastService,
    private schoolService: SchoolService
  ) { }
  public roleData = ['SUPERADMIN', 'YOOYOOADMIN', 'SCHOOLOWNER', 'TEACHER'];
  public roleFields: Object = { text: 'name', value: 'id' };
  public schoolFields: Object = { value: 'name', text: 'name' };
  ngOnInit(): void {
    this.pageSettings = { pageSize: 15 };
    this.toolbar = ['Add', 'Edit', 'Search', 'ExcelExport'];
    this.searchSettings = {};
    this.selectionOptions = { type: 'Single' };
    this.filterOptions = { type: 'CheckBox' };
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      mode: 'Dialog'
    };
    this.editparams = { params: { popupHeight: '800px' } };
    this.initialSort = { columns: [{ field: '', direction: 'Ascending' }] };
    this.userService
      .getAllCredManager()
      .subscribe(res => (this.credManager = res));
    this.schoolService.getSchools()
      .subscribe(res => (this.schools = res));
    this.schoolId = JSON.parse(localStorage.getItem('userInfo')).schoolInfo.id;
  }

  onToolbarClick(args: ClickEventArgs): void {
    if (args.item['properties'].text === 'Excel Export') {
      this.grid.excelExport();
    }
  }

  actionBegin(args: SaveEventArgs): any {
    if (this.enterPress) {
      this.enterPress = false;
      args.cancel = true;

      return false;
    }
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.requestType = args.requestType;
      this.credManagerData = { ...args.rowData };
    }
    if (args.requestType === 'save') {
      if (this.credManagerForm.valid) {
        args.data = this.credManagerData;
        args.data['roleId'] = this.roleData.indexOf(args.data['role']) + 1;
        if(args.data['roleId'] !== '1' && args.data['roleId'] !== '2') {
          args.data['schoolId'] = this.schoolObj['itemData']['id'];
        } else {
          args.data['schoolId'] = '1';
        }

        if (this.requestType === 'add') {
          this.addCredManager(args.data);
        } else if (this.requestType === 'beginEdit') {
          this.updateCredManager(args.data);
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
  preventDefault(): void {
    this.enterPress = true;
  }
  cancel(): void {
    this.grid.closeEdit();
  }
  onSubmit(): void {
    this.grid.endEdit();
  }

  addCredManager(formData): void {
    this.userService.createCredManager(formData)
      .subscribe(res => {
        this.toast.success(res.message);
        this.userService
          .getAllCredManager()
          .subscribe(data => this.credManager = data);
      });
  }
  updateCredManager(formData): void {
    this.userService.updateCredManager(formData)
      .subscribe(res => {
        this.toast.success(res.message);
        this.userService
          .getAllCredManager()
          .subscribe(data => this.credManager = data);
      });
  }

  focusIn(target: HTMLElement): void {
    target.parentElement.classList.add('e-input-focus');
  }

  focusOut(target: HTMLElement): void {
    target.parentElement.classList.remove('e-input-focus');
  }
}
