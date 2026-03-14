import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PlantingAdvisorComponent } from './components/planting-advisor/planting-advisor.component';
import { YieldPredictionComponent } from './components/yield-prediction/yield-prediction.component';
import { FarmerProfileComponent } from './components/farmer-profile/farmer-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    DashboardComponent,
    PlantingAdvisorComponent,
    YieldPredictionComponent,
    FarmerProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
