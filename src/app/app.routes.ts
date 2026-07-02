import { Routes } from '@angular/router';
import { AllRecordsComponent } from './components/all-records/all-records.component';
import { EligibleKidsComponent } from './components/eligible-kids/eligible-kids.component';

export const routes: Routes = [
  { path: '', component: AllRecordsComponent },
  { path: 'all', component: AllRecordsComponent },
  { path: 'all-records', redirectTo: 'all', pathMatch: 'full' },
  { path: 'eligible', component: EligibleKidsComponent },
];
