import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { LayoutComponent } from '../components/layout/layout.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { PlantingAdvisorComponent } from '../components/planting-advisor/planting-advisor.component';
import { YieldPredictionComponent } from '../components/yield-prediction/yield-prediction.component';
import { FarmerProfileComponent } from '../components/farmer-profile/farmer-profile.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'advisor', component: PlantingAdvisorComponent },
      { path: 'prediction', component: YieldPredictionComponent },
      { path: 'profile', component: FarmerProfileComponent },
    ],
  },
];

@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    PlantingAdvisorComponent,
    YieldPredictionComponent,
    FarmerProfileComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class AppFeatureModule {}
