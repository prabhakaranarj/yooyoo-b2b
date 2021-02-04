import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/auth/auth.guard';
import { AssignmentComponent } from './assignment/assignment.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FeesComponent } from './fees/fees.component';
import { LogoutComponent } from './logout/logout.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RaiseATicketComponent } from './raise-a-ticket/raise-a-ticket.component';
import { ReportsComponent } from './reports/reports.component';
import { SchoolComponent } from './school/school.component';
import { UsersComponent } from './users/users.component';

const featuresRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { title: 'Dashboard' }
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: { title: 'Users' }
  },
  {
    path: 'assignment',
    component: AssignmentComponent,
    canActivate: [AuthGuard],
    data: { title: 'Assignment' }
  },
  {
    path: 'school',
    component: SchoolComponent,
    canActivate: [AuthGuard],
    data: { title: 'School' }
  },
  {
    path: 'curriculum',
    component: CurriculumComponent,
    canActivate: [AuthGuard],
    data: { title: 'Curriculum' }
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [AuthGuard],
    data: { title: 'Reports' }
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard],
    data: { title: 'Notice Board' }
  },
  {
    path: 'fees',
    component: FeesComponent,
    canActivate: [AuthGuard],
    data: { title: 'Fees' }
  },
  // {
  //   path: 'raise-a-ticket',
  //   component: RaiseATicketComponent,
  //   canActivate: [AuthGuard],
  //   data: { title: 'Raise-A-Ticket' }
  // },
  {
    path: 'attendance',
    component: AttendanceComponent,
    canActivate: [AuthGuard],
    data: { title: 'Attendance' }
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: { title: 'Logout' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(featuresRoutes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule {}
