import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/auth/auth.guard';
import { LoginGuard } from './core/auth/login.guard';
import { LoginComponent } from './features/login/login.component';
import { HeaderNotificationsComponent } from './shared/header/header-notifications/header-notifications.component';
import { ProfileComponent } from './shared/header/profile/profile.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard], data: { title: 'Home' } },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { title: 'Profile' } },
  { path: 'notification', component: HeaderNotificationsComponent, canActivate: [AuthGuard], data: { title: 'All Notification' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
