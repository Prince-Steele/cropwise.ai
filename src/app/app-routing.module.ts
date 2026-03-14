import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PlantingAdvisorComponent } from './components/planting-advisor/planting-advisor.component';
import { YieldPredictionComponent } from './components/yield-prediction/yield-prediction.component';
import { FarmerProfileComponent } from './components/farmer-profile/farmer-profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'advisor', component: PlantingAdvisorComponent },
  { path: 'prediction', component: YieldPredictionComponent },
  { path: 'profile', component: FarmerProfileComponent },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
