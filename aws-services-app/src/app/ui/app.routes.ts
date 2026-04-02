import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FlashCardComponent } from './components/flash-card/flash-card.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'service/:id', component: FlashCardComponent },
  { path: '**', redirectTo: '' }
];