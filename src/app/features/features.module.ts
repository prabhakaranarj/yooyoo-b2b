import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import {
  RadioButtonModule,
  SwitchModule
} from '@syncfusion/ej2-angular-buttons';
import { CalendarModule, DatePickerModule, DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import {
  AccumulationAnnotationService,
  AccumulationChartModule,
  AccumulationDataLabelService,
  AccumulationLegendService,
  AccumulationTooltipService,
  BarSeriesService,
  CategoryService,
  ChartAnnotationService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  LegendService,
  PieSeriesService,
  TooltipService
} from '@syncfusion/ej2-angular-charts';
import {
  AutoCompleteModule,
  DropDownListModule,
  MultiSelectModule
} from '@syncfusion/ej2-angular-dropdowns';
import {
  EditService,
  FilterService,
  GridModule,
  GroupService,
  PageService,
  SelectionService,
  SortService} from '@syncfusion/ej2-angular-grids';
import {
  MaskedTextBoxModule,
  NumericTextBoxModule,
  TextBoxModule,
  UploaderModule
} from '@syncfusion/ej2-angular-inputs';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { RecaptchaModule } from 'angular-google-recaptcha';
import { SharedModule } from '../shared/shared.module';
import { AssignmentSchoolComponent } from './assignment-school/assignment-school.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { QuizViewComponent } from './curriculum/quiz-view/quiz-view.component';
import { QuizComponent } from './curriculum/quiz/quiz.component';
import { SettingsComponent } from './curriculum/settings/settings.component';
import { TopicComponent } from './curriculum/topics/topic.component';
import { WorksheetComponent } from './curriculum/worksheet/worksheet.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FeaturesRoutingModule } from './features-routing.module';
import { FeesComponent } from './fees/fees.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RaiseATicketComponent } from './raise-a-ticket/raise-a-ticket.component';
import { ReportsComponent } from './reports/reports.component';
import { SchoolReportComponent } from './reports/school-report/school-report.component';
import { StudentReportComponent } from './reports/student-report/student-report.component';
import { SchoolComponent } from './school/school.component';
import { CredManagerComponent } from './users/cred-manager/cred-manager.component';
import { UsersComponent } from './users/users.component';
@NgModule({
  declarations: [
    DashboardComponent,
    UsersComponent,
    SchoolComponent,
    CurriculumComponent,
    NotificationsComponent,
    FeesComponent,
    RaiseATicketComponent,
    AttendanceComponent,
    LoginComponent,
    ReportsComponent,
    AssignmentComponent,
    AssignmentSchoolComponent,
    LogoutComponent,
    CredManagerComponent,
    SettingsComponent,
    QuizComponent,
    QuizViewComponent,
    WorksheetComponent,
    TopicComponent,
    StudentReportComponent,
    SchoolReportComponent
  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    SharedModule,
    GridModule,
    HttpClientModule,
    FormsModule,
    RadioButtonModule,
    DatePickerModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatTabsModule,
    TextBoxModule,
    MatButtonModule,
    SwitchModule,
    UploaderModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    DropDownListModule,
    DialogModule,
    NumericTextBoxModule,
    MaskedTextBoxModule,
    AutoCompleteModule,
    MultiSelectModule,
    ListViewModule,
    AccumulationChartModule,
    ChartModule,
    DateRangePickerModule,
    CalendarModule,
    RecaptchaModule.forRoot({
      siteKey: '6LcxvaEUAAAAAOojJR5vEv5-0FETdKY8LNznIflR'
    })
  ],
  exports: [GridModule],
  providers: [
    PageService,
    SortService,
    FilterService,
    EditService,
    SelectionService,
    GroupService,
    BarSeriesService,
    CategoryService,
    LegendService,
    TooltipService,
    PieSeriesService,
    DataLabelService,
    AccumulationLegendService,
    AccumulationTooltipService,
    AccumulationDataLabelService,
    AccumulationAnnotationService,
    ColumnSeriesService,
    ChartAnnotationService
  ]
})
export class FeaturesModule { }
