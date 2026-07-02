import { Routes } from '@angular/router';
import { AllRecordsComponent } from './components/all-records/all-records.component';
import { EligibleKidsComponent } from './components/eligible-kids/eligible-kids.component';

export const routes: Routes = [
  { path: '', redirectTo: '/all-records', pathMatch: 'full' },
  { path: 'all-records', component: AllRecordsComponent },
  { path: 'eligible', component: EligibleKidsComponent },
];
