import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { AuthComponent } from './auth/auth.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AuthComponent],
  imports: [CommonModule, CoreRoutingModule, SharedModule]
})
export class CoreModule {}
