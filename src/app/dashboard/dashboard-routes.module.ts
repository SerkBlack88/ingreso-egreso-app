import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
// import { authGuard } from '../services/auth.guard';
import { dashboardRoutes } from './dashboard.routes';
import { RouterModule } from '@angular/router';

const rutasHijas = [
  { path: '', 
    component: DashboardComponent,
    children: dashboardRoutes,
    // canActivate: [ authGuard ]
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild( rutasHijas )
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutesModule { }
