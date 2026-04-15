import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { HelpCentreComponent } from './components/help-centre/help-centre.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { SignupComponent } from './components/signup/signup.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    pathMatch: 'full',
    title: 'Cropwise - AI-Powered Farming Assistant',
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
    title: 'About Us - Cropwise',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Log In - Cropwise',
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Create Account - Cropwise',
  },
  {
    path: 'help-centre',
    component: HelpCentreComponent,
    title: 'Help Centre - Cropwise',
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
    title: 'Contact Us - Cropwise',
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    title: 'Privacy Policy - Cropwise',
  },
  {
    path: 'terms-of-use',
    component: TermsOfUseComponent,
    title: 'Terms of Use - Cropwise',
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./app-feature/app-feature.module').then((m) => m.AppFeatureModule),
  },
  { path: 'dashboard', redirectTo: '/app/dashboard', pathMatch: 'full' },
  { path: 'advisor', redirectTo: '/app/advisor', pathMatch: 'full' },
  { path: 'prediction', redirectTo: '/app/prediction', pathMatch: 'full' },
  { path: 'profile', redirectTo: '/app/profile', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
