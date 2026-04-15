import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { HelpCentreComponent } from './components/help-centre/help-centre.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { SignupComponent } from './components/signup/signup.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { SharedModule } from './shared/shared.module';

// NOTE: LayoutComponent, DashboardComponent, PlantingAdvisorComponent,
// YieldPredictionComponent, FarmerProfileComponent are now declared in the
// lazy-loaded AppFeatureModule (app-feature/app-feature.module.ts).

@NgModule({
  declarations: [
    AppComponent,
    AboutUsComponent,
    ContactUsComponent,
    HelpCentreComponent,
    LandingPageComponent,
    LoginComponent,
    PrivacyPolicyComponent,
    SignupComponent,
    TermsOfUseComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
