import { ToastService } from './../../shared/services/toast.service';
import { UtilService } from './../../shared/services/util.service';
import { RaiseTicketService } from './raise-a-ticket.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
  SaveEventArgs,
  SearchSettingsModel,
  SortService,
  ToolbarService,
  TextWrapSettingsModel
} from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'yoo-raise-a-ticket',
  templateUrl: './raise-a-ticket.component.html',
  styleUrls: ['./raise-a-ticket.component.css'],
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
export class RaiseATicketComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;
  tickets = [];
  editSettings: EditSettingsModel;
  pageSettings: PageSettingsModel;
  initialSort: Object;
  searchSettings: SearchSettingsModel;
  filterOptions: FilterSettingsModel;
  wrapSettings: TextWrapSettingsModel;
  line = 'Both';
  showLoader = false;
  ticketData = {};
  @ViewChild('ticketForm') public ticketForm: FormGroup;
  requestType: string;
  toolbar: Array<string>;
  excelExportProperties: ExcelExportProperties;
  public statusData = [
    { statusName: 'Open', id: '1' },
    { statusName: 'Progress', id: '2' },
    { statusName: 'Closed', id: '3' }
  ];
  public statusFields: Object = { text: 'statusName', value: 'id' };
  urole: string;
  constructor(
    private _ticketService: RaiseTicketService,
    private _util: UtilService,
    private toast: ToastService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.wrapSettings = { wrapMode: 'Both' };
    this.pageSettings = { pageSize: 15 };
    this.authService.getuRole()
      .subscribe(res => (this.urole = res));
    if (this.urole !== 'SUPERADMIN' && this.urole !== 'YOOYOOADMIN') {
      this.toolbar = ['Add', 'Search', 'ExcelExport'];
      this.editSettings = {
        allowEditing: false,
        allowAdding: true,
        mode: 'Dialog'
      };
    } else {
      this.toolbar = ['Add', 'Edit' , 'Search', 'ExcelExport'];
      this.editSettings = {
          allowEditing: true,
          allowAdding: true,
          mode: 'Dialog'
        };
    }
    this.searchSettings = {};
    this.filterOptions = { type: 'CheckBox' };
    this.excelExportProperties = {
      fileName: 'Raise_a_Ticket.xlsx'
    };
    this.initialSort = { columns: [{ field: '', direction: 'Ascending' }] };
    this.reload();

  }
  onToolbarClick(args: ClickEventArgs): void {
    if (args.item['properties'].text === 'PDF Export') {
      this.grid.pdfExport();
    } else if (args.item['properties'].text === 'Excel Export') {
      this.grid.excelExport();
    }
  }
  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.requestType = args.requestType;
      this.ticketData = { ...args.rowData };
    }
    if (args.requestType === 'save') {
      if (this.ticketForm.valid) {
        const schoolId = this._util.getSchoolId();
        if (this.requestType === 'beginEdit') {
          this.editTicket(args.data);
        } else if (this.requestType === 'add') {
          args.data['resolution'] = '1';
          args.data['status'] = 'Open';
          args.data['schoolId'] = schoolId;

          this.addTicket(args.data);
        }
      } else {
        args.cancel = true;
      }
    }

    if (args.requestType === 'delete') {
      this.deletTicketData(args.data[0].id);
    }
  }

  actionComplete(args: DialogEditEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
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
  editTicket(data): void {
    this._ticketService.updateTicket(data).subscribe(res => {
      this.toast.success(res.message);
      this.reload();
    });
  }
  addTicket(data): void {
    this._ticketService.submitTicket(data).subscribe(res => {
      this.toast.success(res.message);
      this.reload();
    });
  }
  deletTicketData(id): void {
    this._ticketService.deleteTicket(id).subscribe(res => {
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
    this._ticketService.getTickets().subscribe(res => {
      this.tickets = res;

      res.filter(data => {
        if (data.resolution === 1) {
          data.status = 'Open';
        } else if (data.resolution === 2) {
          data.status = 'Progress';
        } else if (data.resolution === 3) {
          data.status = 'Closed';
        } else {
          data.status = '';
        }
        data['ticketId'] = `YOOYOO0000${data.id}`;
        return data;
      });
      this.showLoader = true;
    });
  }
}
