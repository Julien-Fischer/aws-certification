import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RevisionCardComponent } from './components/revision-card/revision-card.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'service/:id', component: RevisionCardComponent },
  { path: '**', redirectTo: '' }
];